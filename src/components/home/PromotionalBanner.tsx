// src\components\home\PromotionalBanner.tsx

export const PromotionalBanner = ({ settings }: any) => {
  if (settings?.imageUrl) {
    return (
      <div className="w-full h-[150px] relative rounded-xl overflow-hidden shadow-sm">
        <img 
          src={settings.imageUrl} 
          alt={settings.title || "Promo Banner"} 
          className="w-full h-full object-cover"
        />
        {settings.title && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <h2 className="text-xl font-bold text-white drop-shadow-md">
              {settings.title}
            </h2>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full h-[150px] bg-red-50 border-2 border-red-200 border-dashed flex items-center justify-center rounded-xl">
      <h2 className="text-xl font-bold text-red-500">{settings?.title || "Promo Banner Block"}</h2>
    </div>
  );
};