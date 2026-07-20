interface ModalBackdropProps {
  onClose: () => void;
}

/**
 * Full-area click catcher rendered behind a modal's content. Sits inside the
 * modal's (pointer-events-none) wrapper with pointer-events enabled, so clicking
 * anywhere outside the modal box closes it. The modal content renders on top
 * (higher z-index) and receives its own clicks normally.
 */
export function ModalBackdrop({ onClose }: ModalBackdropProps) {
  return <div className="absolute inset-0 z-40 pointer-events-auto" onClick={onClose} />;
}

export default ModalBackdrop;
