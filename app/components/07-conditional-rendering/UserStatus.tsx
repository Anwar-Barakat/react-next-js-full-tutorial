interface UserStatusProps {
  loggedIn: boolean;
  isAdmin: boolean;
}

const UserStatus = (props: UserStatusProps) => {
  return (
    <div className="center-content py-12 px-4">
      <div className="max-w-2xl w-full bg-card border border-border rounded-lg p-6 md:p-8">
        {props.loggedIn && props.isAdmin && (
          <p className="text-xl font-bold text-accent center-text">
            Welcome Admin! 👑
          </p>
        )}
        {props.loggedIn && !props.isAdmin && (
          <p className="text-xl font-semibold text-primary center-text">
            Welcome User! 👋
          </p>
        )}
        {!props.loggedIn && (
          <p className="text-xl font-semibold text-secondary center-text">
            Please log in. 🔒
          </p>
        )}
      </div>
    </div>
  );
};

export default UserStatus;
