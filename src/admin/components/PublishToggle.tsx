interface PublishToggleProps {
  published: boolean;
  onToggle: () => void;
}

export default function PublishToggle({ published, onToggle }: PublishToggleProps) {
  return (
    <button
      className={`publish-toggle ${published ? 'publish-toggle--active' : ''}`}
      onClick={onToggle}
      title={published ? 'Published — click to unpublish' : 'Draft — click to publish'}
    >
      <span className="publish-toggle__dot" />
    </button>
  );
}
