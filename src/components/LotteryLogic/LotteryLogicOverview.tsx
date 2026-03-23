export function LotteryLogicOverview() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 pb-16 md:pb-24">
      <section className="mb-10 md:mb-12">
        <h1 className="text-[clamp(1.5rem,4vw,1.875rem)] text-[color:var(--er-slate-800)] leading-tight tracking-tight mb-4">
          What is RAS?
        </h1>
        <p className="font-sans text-base leading-relaxed text-[color:var(--er-gray-600)] max-w-prose">
          RAS replaces the old booking system where members raced to grab reservations the moment they opened. Instead, members submit a wish list in
          advance and a weighted lottery runs to match them to available inventory.
        </p>
      </section>

      <section className="mb-10 md:mb-12">
        <h2 className="text-xl md:text-2xl text-[color:var(--er-slate-800)] font-light tracking-tight mb-5 md:mb-6">
          What the member does
        </h2>
        <ol className="list-decimal list-outside pl-5 sm:pl-6 space-y-3 md:space-y-3.5 font-sans text-[0.9375rem] md:text-base leading-relaxed text-[color:var(--er-slate-800)] marker:text-[color:var(--er-slate-700)] marker:font-medium">
          <li className="pl-1">Browse available destinations and dates for the upcoming quarter</li>
          <li className="pl-1">Build a request list and rank them in order of preference</li>
          <li className="pl-1">Distribute points across requests to signal how much you want each one</li>
          <li className="pl-1">Submit before the deadline</li>
          <li className="pl-1">Receive results and accept or decline your wins</li>
        </ol>
      </section>

      <section className="mb-10 md:mb-12">
        <h2 className="text-xl md:text-2xl text-[color:var(--er-slate-800)] font-light tracking-tight mb-4 md:mb-5">
          How requests are scored
        </h2>
        <p className="font-sans text-[0.9375rem] md:text-base leading-relaxed text-[color:var(--er-gray-700)] mb-6 md:mb-8 max-w-prose">
          The member never sees this. Every request gets a score that determines lottery odds. Higher score means better chances — but it&apos;s never
          a guarantee.
        </p>

        <div className="space-y-4 md:space-y-5">
          <div className="rounded-xl border border-[color:var(--er-gray-200)] bg-white p-4 md:p-5 shadow-[var(--er-shadow-xs)]">
            <h3 className="font-sans text-sm font-semibold text-[color:var(--er-slate-800)] mb-2 tracking-wide">Rank</h3>
            <p className="font-sans text-[0.9375rem] leading-relaxed text-[color:var(--er-gray-700)] m-0">
              Position assigned by the member. #1 scores highest, #10 lowest.
            </p>
          </div>
          <div className="rounded-xl border border-[color:var(--er-gray-200)] bg-white p-4 md:p-5 shadow-[var(--er-shadow-xs)]">
            <h3 className="font-sans text-sm font-semibold text-[color:var(--er-slate-800)] mb-2 tracking-wide">Points</h3>
            <p className="font-sans text-[0.9375rem] leading-relaxed text-[color:var(--er-gray-700)] m-0">
              The member&apos;s own points stacked onto a request. More points on one request raises its odds relative to their others.
            </p>
          </div>
          <div className="rounded-xl border border-[color:var(--er-gray-200)] bg-white p-4 md:p-5 shadow-[var(--er-shadow-xs)]">
            <h3 className="font-sans text-sm font-semibold text-[color:var(--er-slate-800)] mb-2 tracking-wide">Loss Multiplier</h3>
            <p className="font-sans text-[0.9375rem] leading-relaxed text-[color:var(--er-gray-700)] m-0">
              Members who keep losing their top-ranked requests across multiple cycles automatically earn a growing boost. Resets when they win
              something they ranked in their top three. This is the core fairness mechanism.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-[rgba(0,71,80,0.18)] bg-[rgba(0,71,80,0.06)] p-5 md:p-6">
        <p className="font-sans text-[0.9375rem] md:text-base leading-relaxed text-[color:var(--er-slate-800)] m-0">
          The member experience is simple — browse, rank, submit. All the complexity lives in the scoring engine. The UI never exposes the math.
        </p>
      </section>
    </div>
  );
}
