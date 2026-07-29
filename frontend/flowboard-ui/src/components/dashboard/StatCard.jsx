function StatCard({ title, value, subtitle, color }) {
  return (
    <div className="rounded-xl border border-surface-strong bg-surface-soft p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-lg hover:shadow-primary/10">

      <p className="text-sm text-muted-custom">
        {title}
      </p>

      <h2 className={`mt-3 text-4xl font-bold ${color}`}>
        {value}
      </h2>

      <p className="mt-2 text-sm text-muted-custom">
        {subtitle}
      </p>

    </div>
  );
}

export default StatCard;