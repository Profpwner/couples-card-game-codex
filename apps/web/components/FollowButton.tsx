import React from 'react';

export default function FollowButton({ following, disabled }: { following: boolean; disabled?: boolean }) {
  return (
    <button disabled={disabled} aria-disabled={disabled} aria-pressed={following}>
      {following ? 'Unfollow Creator' : 'Follow Creator'}
    </button>
  );
}

