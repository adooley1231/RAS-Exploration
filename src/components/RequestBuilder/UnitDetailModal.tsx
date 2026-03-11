import { useState } from 'react';
import {
  X,
  Bed,
  Users,
  Bath,
  Maximize,
  ChevronLeft,
  ChevronRight,
  Check,
  Sparkles,
} from 'lucide-react';
import type { Unit } from '../../types';

interface UnitDetailModalProps {
  unit: Unit;
  destinationName: string;
  isSelected: boolean;
  onSelect: () => void;
  onClose: () => void;
}

export function UnitDetailModal({
  unit,
  destinationName,
  isSelected,
  onSelect,
  onClose,
}: UnitDetailModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = unit.images || (unit.imageUrl ? [unit.imageUrl] : []);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleSelectAndClose = () => {
    onSelect();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden card-shadow">
        {/* Image gallery */}
        <div className="relative h-64 sm:h-80 bg-slate-100">
          {images.length > 0 ? (
            <>
              <img
                src={images[currentImageIndex]}
                alt={`${unit.name} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-navy" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-navy" />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              No images available
            </div>
          )}

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
          >
            <X className="w-5 h-5 text-navy" />
          </button>

          {/* Selected badge */}
          {isSelected && (
            <div className="absolute top-3 left-3 px-3 py-1.5 bg-gold text-white text-sm font-medium rounded-full flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              Selected
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-4">
            <p className="text-sm text-slate-500">{destinationName}</p>
            <h2 className="font-serif text-2xl font-semibold text-navy">{unit.name}</h2>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-4 mb-6 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-2 text-navy-light">
              <Bed className="w-5 h-5 text-gold" />
              <span>
                {unit.bedrooms} bedroom{unit.bedrooms !== 1 ? 's' : ''}
              </span>
            </div>
            {unit.bathrooms && (
              <div className="flex items-center gap-2 text-navy-light">
                <Bath className="w-5 h-5 text-gold" />
                <span>
                  {unit.bathrooms} bathroom{unit.bathrooms !== 1 ? 's' : ''}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 text-navy-light">
              <Users className="w-5 h-5 text-gold" />
              <span>Sleeps {unit.sleeps}</span>
            </div>
            {unit.squareFeet && (
              <div className="flex items-center gap-2 text-navy-light">
                <Maximize className="w-5 h-5 text-gold" />
                <span>{unit.squareFeet.toLocaleString()} sq ft</span>
              </div>
            )}
          </div>

          {/* Description */}
          {unit.description && (
            <div className="mb-6">
              <h3 className="font-medium text-navy mb-2">About this unit</h3>
              <p className="text-slate-600 leading-relaxed">{unit.description}</p>
            </div>
          )}

          {/* Features */}
          {unit.features && unit.features.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium text-navy mb-3">Amenities & Features</h3>
              <div className="flex flex-wrap gap-2">
                {unit.features.map((feature) => (
                  <span
                    key={feature}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 text-sm rounded-lg"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-gold" />
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={onClose}
              className="flex-1 py-3 border border-slate-200 text-navy rounded-xl font-medium hover:bg-slate-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleSelectAndClose}
              className={`flex-1 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${
                isSelected
                  ? 'bg-slate-100 text-slate-500'
                  : 'bg-navy text-white hover:bg-navy-light'
              }`}
            >
              {isSelected ? (
                <>
                  <Check className="w-4 h-4" />
                  Currently Selected
                </>
              ) : (
                'Select This Unit'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
