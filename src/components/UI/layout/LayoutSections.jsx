export const ColsContainer = (props) => {
  return (
    <section className={`bi-l-container-cols ${props.className}`} style={props.style}>
      {props.children}
    </section>
  );
}

export const SimpleCol = (props) => {
  return (
    <section
      className={`bi-l-col ${props.className}`} style={props.style}>
        {props.children}
    </section>
  );
}

export const SectionHalf = (props) => {
  return (
    <section
      className={`bi-l-6col ${props.className}`} style={props.style}>
        {props.children}
    </section>
  );
}

export const SectionThird = (props) => {
  return (
    <section
      className={`bi-l-4col ${props.className}`} style={props.style}>
        {props.children}
    </section>
  );
}