import { X, Pencil, PlusCircle, ExternalLink } from 'lucide-react';
import { useRAS } from '../../context/RASContext';

export function EditAllocationGuideModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { openAnnotationCallout } = useRAS();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-navy/40 backdrop-blur-sm" aria-label="Close" onClick={onClose} />
      <div
        className="relative w-full max-w-md rounded-2xl shadow-xl p-6"
        style={{ background: 'var(--er-white)', border: '1px solid var(--er-gray-200)' }}
        role="dialog"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <Pencil className="w-5 h-5" style={{ color: 'var(--er-slate-700)' }} />
            <h3 style={{ fontFamily: 'var(--er-font-serif)', fontWeight: 400, fontSize: '1.125rem', color: 'var(--er-slate-800)', margin: 0 }}>
              Edit allocation
            </h3>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100" style={{ color: 'var(--er-gray-400)' }}>
            <X className="w-4 h-4" />
          </button>
        </div>
        <p style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.875rem', color: 'var(--er-gray-600)', lineHeight: 1.6, margin: 0 }}>
          In Compass, ambassadors use the same rank and point-allocation experience as members—either while impersonating the member account or in
          a dedicated “manage on behalf” flow. Adjust ranks, move points between requests, and resolve duplicate-destination warnings before you
          submit.
        </p>
        <ul className="mt-4 space-y-2 pl-4 list-disc" style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.8125rem', color: 'var(--er-gray-600)' }}>
          <li>Every point in the quarterly budget must be allocated to submit.</li>
          <li>High-demand weeks are visible so you can set expectations with the member.</li>
        </ul>
        <button
          type="button"
          onClick={() => {
            openAnnotationCallout('ambassador-submit-on-behalf');
            onClose();
          }}
          className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm"
          style={{
            fontFamily: 'var(--er-font-sans)',
            color: 'var(--color-teal)',
            background: 'rgba(27,102,117,0.06)',
            border: '1px solid rgba(27,102,117,0.2)',
            cursor: 'pointer',
          }}
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Prototype / data model notes
        </button>
        <button
          type="button"
          onClick={onClose}
          className="mt-2 w-full py-2.5 rounded-xl font-medium text-sm"
          style={{
            fontFamily: 'var(--er-font-sans)',
            background: 'var(--er-slate-800)',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Got it
        </button>
      </div>
    </div>
  );
}

export function AddRequestInfoModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-navy/40 backdrop-blur-sm" aria-label="Close" onClick={onClose} />
      <div
        className="relative w-full max-w-md rounded-2xl shadow-xl p-6"
        style={{ background: 'var(--er-white)', border: '1px solid var(--er-gray-200)' }}
        role="dialog"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5" style={{ color: 'var(--color-teal)' }} />
            <h3 style={{ fontFamily: 'var(--er-font-serif)', fontWeight: 400, fontSize: '1.125rem', color: 'var(--er-slate-800)', margin: 0 }}>
              Add a request
            </h3>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100" style={{ color: 'var(--er-gray-400)' }}>
            <X className="w-4 h-4" />
          </button>
        </div>
        <p style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.875rem', color: 'var(--er-gray-600)', lineHeight: 1.6, margin: 0 }}>
          This prototype doesn’t include a full destination picker here. In production, you’d add destinations and date ranges the same way a
          member does—from the ambassador console or while assisting them in the member app.
        </p>
        <p style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.8125rem', color: 'var(--er-gray-500)', lineHeight: 1.5, marginTop: '12px' }}>
          Tip: Ask the member to log in and build their wishlist, then help them allocate points and submit when they’re ready.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full py-2.5 rounded-xl font-medium text-sm"
          style={{
            fontFamily: 'var(--er-font-sans)',
            background: 'var(--er-slate-800)',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}
