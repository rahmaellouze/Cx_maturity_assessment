type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export default function SectionHeader({
  eyebrow,
  title,
  description,
}: SectionHeaderProps) {
  return (
    <div className="max-w-4xl">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#98A2B3]">
        {eyebrow}
      </p>
      <h2 className="max-w-3xl text-[2.4rem] font-semibold leading-[1.02] tracking-[-0.05em] text-[#1A1A1A] md:text-[3.4rem]">
        {title}
      </h2>
      <div className="mt-6 h-1 w-14 rounded-full bg-[#111827]" />
      <p className="mt-5 max-w-3xl text-base leading-8 text-[#4B5563] md:text-[1.05rem]">
        {description}
      </p>
    </div>
  );
}
