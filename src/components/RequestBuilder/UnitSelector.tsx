import { useState, useRef, useEffect } from 'react';
import { Home, ChevronDown, Users, Bed, Check, Sparkles, Eye } from 'lucide-react';
import type { Unit } from '../../types';
import { UnitDetailModal } from './UnitDetailModal';

interface UnitSelectorProps {
  units: Unit[];
  /** Selected units (empty = Any unit). Supports multiple selection. */
  value: Unit[];
  onChange: (units: Unit[]) => void;
  disabled?: boolean;
  destinationName?: string;
}

export function UnitSelector({
  units,
  value,
  onChange,
  disabled = false,
  destinationName = '',
}: UnitSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewingUnit, setViewingUnit] = useState<Unit | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectAny = () => {
    onChange([]);
    setIsOpen(false);
  };

  const handleToggleUnit = (unit: Unit) => {
    const isSelected = value.some((u) => u.id === unit.id);
    if (isSelected) {
      onChange(value.filter((u) => u.id !== unit.id));
    } else {
      onChange([...value, unit]);
    }
  };

  const handleViewDetails = (e: React.MouseEvent, unit: Unit) => {
    e.stopPropagation();
    setViewingUnit(unit);
  };

  const isAnyUnit = value.length === 0;
  const isUnitSelected = (unit: Unit) => value.some((u) => u.id === unit.id);

  if (disabled || units.length === 0) {
    return (
      <div className="opacity-50">
        <label className="block text-sm font-medium text-navy mb-2">Unit preference</label>
        <div className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-400">
          Select a destination first
        </div>
      </div>
    );
  }

  return (
    <>
      <div ref={containerRef} className="relative">
        <label className="block text-sm font-medium text-navy mb-2">Unit preference</label>
        <p className="text-xs text-slate-500 mb-1.5">
          Choose one or more units — you’ll be matched to any of your selections.
        </p>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between px-4 py-3 bg-white border rounded-xl transition-premium ${
            isOpen ? 'border-gold ring-2 ring-gold/20' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <Home className="w-5 h-5 text-gold flex-shrink-0" />
            {isAnyUnit ? (
              <div className="text-left min-w-0">
                <p className="font-medium text-navy">Any unit</p>
                <p className="text-xs text-slate-500">Best availability</p>
              </div>
            ) : value.length === 1 ? (
              <div className="text-left min-w-0">
                <p className="font-medium text-navy">{value[0].name}</p>
                <p className="text-xs text-slate-500">
                  {value[0].bedrooms} BR · Sleeps {value[0].sleeps}
                </p>
              </div>
            ) : (
              <div className="text-left min-w-0">
                <p className="font-medium text-navy">{value.length} units selected</p>
                <p className="text-xs text-slate-500 truncate">
                  {value.map((u) => u.name).join(', ')}
                </p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {value.length > 0 && value.length <= 2 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewDetails(e, value[0]);
                }}
                className="p-1.5 text-slate-400 hover:text-gold hover:bg-gold/10 rounded-lg transition-colors"
                title="View unit details"
              >
                <Eye className="w-4 h-4" />
              </button>
            )}
            <ChevronDown
              className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            />
          </div>
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
            {/* Any unit option */}
            <button
              type="button"
              onClick={handleSelectAny}
              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-100 ${
                isAnyUnit ? 'bg-gold/5' : ''
              }`}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-gold/20 to-gold/10 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-gold" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-navy">Any unit</p>
                <p className="text-xs text-slate-500">
                  Increases chances — we’ll match you to any available unit
                </p>
              </div>
              {isAnyUnit && <Check className="w-5 h-5 text-gold" />}
            </button>

            {/* Multi-select units */}
            <div className="p-2 border-b border-slate-100">
              <p className="text-xs font-medium text-slate-500 px-2 py-1">
                Or select one or more specific units:
              </p>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {units.map((unit) => {
                const selected = isUnitSelected(unit);
                return (
                  <div
                    key={unit.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleToggleUnit(unit)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleToggleUnit(unit);
                      }
                    }}
                    className={`flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer ${
                      selected ? 'bg-gold/5' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <div
                      className={`flex-shrink-0 w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center transition-colors ${
                        selected
                          ? 'bg-gold border-gold'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {selected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                    </div>

                    {/* Unit thumbnail */}
                    <div className="w-14 h-14 bg-slate-100 rounded-lg flex-shrink-0 overflow-hidden">
                      {unit.imageUrl ? (
                        <img
                          src={unit.imageUrl}
                          alt={unit.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Home className="w-5 h-5 text-slate-400" />
                        </div>
                      )}
                    </div>

                    {/* Unit info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-navy">{unit.name}</p>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Bed className="w-3 h-3" />
                          {unit.bedrooms} BR
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          Sleeps {unit.sleeps}
                        </span>
                        {unit.squareFeet && (
                          <span>{unit.squareFeet.toLocaleString()} sq ft</span>
                        )}
                      </div>
                      {unit.features && unit.features.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {unit.features.slice(0, 3).map((feature) => (
                            <span
                              key={feature}
                              className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded"
                            >
                              {feature}
                            </span>
                          ))}
                          {unit.features.length > 3 && (
                            <span className="px-2 py-0.5 text-slate-400 text-xs">
                              +{unit.features.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleViewDetails(e, unit)}
                      className="text-xs text-gold hover:text-gold-dark font-medium hover:underline flex-shrink-0"
                    >
                      Details
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {viewingUnit && (
        <UnitDetailModal
          unit={viewingUnit}
          destinationName={destinationName}
          isSelected={isUnitSelected(viewingUnit)}
          onSelect={() => {
            handleToggleUnit(viewingUnit);
          }}
          onClose={() => setViewingUnit(null)}
        />
      )}
    </>
  );
}
