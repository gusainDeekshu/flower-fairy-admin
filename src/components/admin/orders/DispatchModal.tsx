'use client';

import { useState } from 'react';
import { Truck, X, Loader2, CheckCircle } from 'lucide-react';
import  apiClient  from '@/lib/api-client'; // Assuming you have an axios instance setup here
import { toast } from 'react-hot-toast';

interface DispatchModalProps {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (shipmentData: any) => void;
}

export default function DispatchOrderModal({ orderId, isOpen, onClose, onSuccess }: DispatchModalProps) {
  const [loading, setLoading] = useState(false);
  const [courierId, setCourierId] = useState('');

  if (!isOpen) return null;

  const handleDispatch = async () => {
    setLoading(true);
    try {
      // Calls the NestJS endpoint we just created in Part 2
      const response = await apiClient.post(`/admin/shipping/dispatch/${orderId}`, {
        courierId: courierId || undefined, // Optional: Let Shiprocket auto-assign if empty
      });
      
      toast.success('Shipment created successfully!');
      onSuccess(response.data);
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to dispatch order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Truck className="h-5 w-5 text-blue-600" />
            Dispatch Order
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-4 my-6">
          <p className="text-sm text-gray-600">
            This will push the order details to Shiprocket, assign an AWB, and mark the order as <strong>SHIPPED</strong>.
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Force Specific Courier ID (Optional)
            </label>
            <input
              type="text"
              value={courierId}
              onChange={(e) => setCourierId(e.target.value)}
              placeholder="e.g., 10 (Delhivery) or leave blank for auto"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleDispatch}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
            {loading ? 'Processing...' : 'Confirm Dispatch'}
          </button>
        </div>
      </div>
    </div>
  );
}