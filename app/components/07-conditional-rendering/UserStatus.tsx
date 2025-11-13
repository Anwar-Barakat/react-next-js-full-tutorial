interface UserStatusProps {
  loggedIn: boolean;
  isAdmin: boolean;
}

const UserStatus = (props: UserStatusProps) => {
  return (
    <div className="center-content py-12 px-4">
      <div className="max-w-2xl w-full bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] p-6 md:p-8 shadow-[var(--shadow-md)]">
        {props.loggedIn && props.isAdmin && (
          <p className="text-xl font-bold text-[var(--accent)] center-text">
            Welcome Admin! 👑
          </p>
        )}
        {props.loggedIn && !props.isAdmin && (
          <p className="text-xl font-semibold text-[var(--primary)] center-text">
            Welcome User! 👋
          </p>
        )}
        {!props.loggedIn && (
          <p className="text-xl font-semibold text-[var(--secondary)] center-text">
            Please log in. 🔒
          </p>
        )}
      </div>
    </div>
  );
};

export default UserStatus;
