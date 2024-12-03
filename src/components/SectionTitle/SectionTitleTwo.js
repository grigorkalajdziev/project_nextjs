const SectionTitleTwo = ({ title, subtitle }) => {
  return (
    <div className="section-title-container text-center space-mb--r80">
      {subtitle ? <h4 className="section-title--secondary">{subtitle}</h4> : ""}
      <h2 className={`section-title ${subtitle ? "space-mt--20" : ""}`}>
        {title}
      </h2>
    </div>
  );
};

export default SectionTitleTwo;
