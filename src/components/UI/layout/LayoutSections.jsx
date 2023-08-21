export const SectionHalf = (props) => {
  return (
    <section
      className={`bi-l-6col ${props.className}`}>
        {props.children}
    </section>
  );
}

export const SectionThird = (props) => {
  return (
    <section
      className={`bi-l-4col ${props.className}`}>
        {props.children}
    </section>
  );
}