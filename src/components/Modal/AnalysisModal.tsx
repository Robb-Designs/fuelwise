// type definitions for the AnalysisModal component
// this type is responsible for defining the props that the AnalysisModal component will receive. In this case, it expects a single prop called onClose, which is a function that takes no arguments and returns void. This function will be used to close the modal when the user clicks the cancel button or submits the form.
type AnalysisModalProps = {
  onClose: () => void;
  onConnect?: () => void;
};

export default function AnalysisModal({ onClose, onConnect }: AnalysisModalProps) {
  return (
    // Modal overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-6 py-10 overflow-y-auto">
      {/* Modal card -------------------------------------------------------------------------*/}
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-7 rounded-2xl bg-white p-8 shadow-2xl">
          {/* Header --------------------------------------------------------------------------*/}
          <div className="flex flex-col gap-3">
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
              Connect Your Activity Account
            </h2>

            <p className="text-sm leading-relaxed text-gray-600">
              Import your activity data automatically to unlock personalized
              workload analysis, recovery monitoring, and injury risk insights.
            </p>
          </div>

          {/* Benefits ------------------------------------------------------------------------------*/}
          <div className="flex flex-col gap-3 border-y border-gray-100 py-5">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-900">✓</span>
              <p className="text-sm text-gray-700">
                Automatic activity syncing
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-900">✓</span>
              <p className="text-sm text-gray-700">
                Weekly training load tracking
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-900">✓</span>
              <p className="text-sm text-gray-700">Recovery trend insights</p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-900">✓</span>
              <p className="text-sm text-gray-700">Injury risk monitoring</p>
            </div>
          </div>

          {/* Action buttons ---------------------------------------------------------------------------*/}
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={onConnect}
              className="rounded-md bg-[#FC4C02] py-3 font-medium text-white transition hover:opacity-90"
            >
              Connect Account
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 bg-white py-3 font-medium text-gray-700 transition hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
          {/* Privacy copy -----------------------------------------------------------------------------*/}
          <p className="mt-6 text-xs leading-relaxed text-gray-500">
            Your activity data stays private and secure. FuelWise only accesses
            workout activity and training metrics needed for analysis.
          </p>
        </div>
      </div>
    </div>
  );
}
