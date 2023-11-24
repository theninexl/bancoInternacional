import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';

export const ButtonLPrimary = (props) => {
  return (
    <button
      type={props.type}
      className={`bi-o-button-large--primary ${props.className}`}
      onClick={props.handleClick}>
        {props.children}
    </button>
  );
}

export const ButtonLSecondary = (props) => {
  return (
    <button
      type={props.type}
      className={`bi-o-button-large--secondary ${props.className}`}
      onClick={props.handleClick}>
        {props.children}
    </button>
  );
}

export const ButtonLTransparent = (props) => {
  return (
    <button
      type={props.type}
      className={`bi-o-button-large--transparent ${props.className}`}
      onClick={props.handleClick}>
        {props.children}
    </button>
  );
}

export const ButtonLGhost = (props) => {
  return (
    <button
      type={props.type}
      className={`bi-o-button-large--ghost ${props.className}`}
      onClick={props.handleClick}>
        {props.children}
    </button>
  );
}

export const ButtonMPrimary = (props) => {
  return (
    <button
      type={props.type}
      className={`bi-o-button-medium--primary ${props.className}`}
      onClick={props.handleClick}>
        {props.children}
    </button>
  );
}

export const ButtonMGhost = (props) => {
  return (
    <button
      type={props.type}
      className={`bi-o-button-medium--ghost ${props.className}`}
      onClick={props.handleClick}>
        {props.children}
    </button>
  );
}

export const SortButton = (props) => {
  return (
    <button
      data-column={props.orderCol}
      className={`bi-o-sortButton ${props.className}`}
      onClick={props.handleClick}
      >
      {props.children}
      <span className='sortIcon--desc bi-u-inactive'><ChevronDownIcon /></span>
      <span className='sortIcon--asc bi-u-inactive'><ChevronUpIcon /></span>
    </button>
  );
}
