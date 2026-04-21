// src\components\home\HeroBanner.tsx


export const HeroBanner = ({ settings }: any) => {
  // If an image is uploaded, display it as the background
  if (settings?.imageUrl) {
    return (
      <div className="w-full h-[400px] relative rounded-xl overflow-hidden shadow-md">
        <img 
          src={settings.imageUrl} 
          alt={settings.title || "Hero Banner"} 
          className="w-full h-full object-cover"
        />
        {/* Optional: Show title overlay if a title is set */}
        {settings.title && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <h2 className="text-3xl font-black text-white tracking-tight drop-shadow-lg">
              {settings.title}
            </h2>
          </div>
        )}
      </div>
    );
  }

  // Fallback: The dashed placeholder if no image is uploaded yet
  return (
    <div className="w-full h-[400px] bg-blue-50 border-2 border-blue-200 border-dashed flex items-center justify-center rounded-xl">
      <h2 className="text-xl font-bold text-blue-500">{settings?.title || "Hero Banner Block"}</h2>
    </div>
  );
};