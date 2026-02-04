import "./SideBarTitle.css";
const SidebarTitle = ({
  title,
  isActive = false,
  onClick,
  icon, 
}) => {
  return (
    <div
      className={`sidebar-title ${isActive ? "active" : ""}`}
      onClick={onClick}
    >
      {icon && <span className="sidebar-icon">{icon}</span>}
      <span className="sidebar-text">{title}</span>
    </div>
  );
};

export default SidebarTitle;
