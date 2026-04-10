'use client';

import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Save, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Switch } from '../ui/Switch';

/* ---------------------- TYPE MAPPING ---------------------- */

const FIELD_TYPES: Record<string, 'string' | 'number' | 'boolean'> = {
  port: 'number',
  channel_id: 'number',
  salt_index: 'number',

  secure: 'boolean',
  is_production: 'boolean',
  show_estimation: 'boolean',
};

/* ---------------------- SCHEMA (UNCHANGED DESIGN) ---------------------- */

const PROVIDER_SCHEMAS: Record<string, Record<string, string[]>> = {
  EMAIL: {
    SMTP: ['host', 'port', 'secure', 'user', 'password', 'from'],
    AWS_SES: ['accessKeyId', 'secretAccessKey', 'region', 'from'],
    SENDGRID: ['apiKey', 'from'],
  },
  SMS: {
    FAST2SMS: ['apiKey'],
    MSG91: [
      'authKey',
      'templateId',
      'template_order_placed',
      'template_order_confirmed',
      'template_order_shipped',
      'template_order_delivered',
      'template_order_cancelled',
    ],
    TWILIO: ['accountSid', 'authToken', 'fromNumber'],
  },
  PAYMENT: {
    RAZORPAY: ['key_id', 'key_secret'],
    STRIPE: ['public_key', 'secret_key', 'webhook_secret'],
    PHONEPE: [
      'merchant_id',
      'salt_key',
      'salt_index',
      'frontend_url',
      'backend_webhook_url',
      'is_production',
    ],
    PAYU: [
      'merchant_key',
      'merchant_salt',
      'frontend_url',
      'backend_webhook_url',
      'is_production',
    ],
  },
  SHIPPING: {
    SHIPROCKET: [
      'email',
      'password',
      'token',
      'pickup_location',
      'channel_id',
      'show_estimation',
      'preferred_courier_name',
    ],
    DELHIVERY: ['apiKey', 'clientName'],
    NIMBUSPOST: ['email', 'password', 'token'],
  },
};

export default function ProviderModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  activeType,
}: any) {
  const [providerName, setProviderName] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [priority, setPriority] = useState(1);
  const [config, setConfig] = useState<Record<string, any>>({});
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);

  const availableProviders = Object.keys(PROVIDER_SCHEMAS[activeType] || {});

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setProviderName(initialData.provider);
        setIsActive(initialData.isActive);
        setPriority(initialData.priority);
        setConfig(initialData.config || {});
      } else {
        const defaultProv = availableProviders[0] || '';
        setProviderName(defaultProv);
        setIsActive(true);
        setPriority(1);
        setConfig(defaultProv ? getEmptyConfig(defaultProv) : {});
      }
      setShowSecrets({});
      setIsSaving(false);
    }
  }, [initialData, isOpen, activeType]);

  const getEmptyConfig = (prov: string) => {
    return (PROVIDER_SCHEMAS[activeType]?.[prov] || []).reduce(
      (acc, key) => ({ ...acc, [key]: '' }),
      {}
    );
  };

  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newProv = e.target.value;
    setProviderName(newProv);
    setConfig(getEmptyConfig(newProv));
  };

  const isSecretField = (key: string) =>
    /secret|password|key|salt/i.test(key);

  const toggleSecretView = (key: string) =>
    setShowSecrets((prev) => ({ ...prev, [key]: !prev[key] }));

  const getFieldType = (key: string) => FIELD_TYPES[key] || 'string';

  /* ---------------------- VALIDATION ---------------------- */

  const validateConfig = () => {
    const schema = PROVIDER_SCHEMAS[activeType]?.[providerName] || [];
    const errors: string[] = [];

    schema.forEach((key) => {
      const type = getFieldType(key);
      const value = config[key];

      if (value === '' || value === undefined) {
        errors.push(`${key} is required`);
        return;
      }

      if (type === 'number' && isNaN(value)) {
        errors.push(`${key} must be a valid number`);
      }

      if (type === 'boolean' && typeof value !== 'boolean') {
        errors.push(`${key} must be true or false`);
      }
    });

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSaving) return;

    const errors = validateConfig();
    if (errors.length > 0) {
      toast.error(errors[0]);
      return;
    }

    try {
      setIsSaving(true);

      await onSave({
        id: initialData?.id,
        type: activeType,
        provider: providerName,
        isActive,
        priority,
        config,
      });

      toast.success('Provider configuration saved successfully!');
      onClose();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to save configuration.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  const currentSchema = PROVIDER_SCHEMAS[activeType]?.[providerName] || [];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
      <div
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
        onClick={() => !isSaving && onClose()}
      />

      <form
        onSubmit={handleSubmit}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* HEADER */}
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              {initialData ? 'Edit Integration' : 'New Integration'}
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">
              Configure API keys and connection settings.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="text-gray-400 hover:text-gray-600 bg-white hover:bg-gray-100 p-2 rounded-full"
          >
            <X size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="px-6 py-6 max-h-[65vh] overflow-y-auto space-y-6">
          <div className="grid grid-cols-2 gap-5">
            <select
              value={providerName}
              onChange={handleProviderChange}
              className="w-full px-3 py-2 border rounded-lg"
            >
              {availableProviders.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>

            <input
              type="number"
              value={priority}
              onChange={(e) => setPriority(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <Switch checked={isActive} onChange={setIsActive} />

          {currentSchema.map((key) => {
            const type = getFieldType(key);
            const value = config[key];
            const isSecret = isSecretField(key);
            const showVal = showSecrets[key];

            return (
              <div key={key}>
                <label className="text-sm font-medium">{key}</label>

                {type === 'boolean' ? (
                  <select
                    value={value ?? ''}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        [key]: e.target.value === 'true',
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="">Select</option>
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                ) : (
                  <input
                    type={
                      type === 'number'
                        ? 'number'
                        : isSecret && !showVal
                        ? 'password'
                        : 'text'
                    }
                    value={value ?? ''}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        [key]:
                          type === 'number'
                            ? Number(e.target.value)
                            : e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button 
            type="button"
            onClick={onClose} 
            disabled={isSaving}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            Cancel
          </button>
          
          <button 
            type="submit"
            disabled={isSaving}
            className="flex items-center justify-center gap-2 min-w-[140px] px-4 py-2 text-sm font-medium text-white bg-rose-600 border border-transparent rounded-lg hover:bg-rose-700 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-sm shadow-rose-600/20"
          >
            {isSaving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save Settings
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}