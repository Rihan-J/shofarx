interface StatusBadgeProps {
  published?: boolean;
  read?: boolean;
  type?: 'publish' | 'read';
}

export default function StatusBadge({ published, read, type = 'publish' }: StatusBadgeProps) {
  if (type === 'read') {
    return (
      <span className={`badge ${read ? 'badge--read' : 'badge--unread'}`}>
        {read ? 'Read' : 'New'}
      </span>
    );
  }

  return (
    <span className={`badge ${published ? 'badge--published' : 'badge--draft'}`}>
      {published ? 'Published' : 'Draft'}
    </span>
  );
}
