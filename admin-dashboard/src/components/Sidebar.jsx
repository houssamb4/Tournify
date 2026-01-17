import { Drawer, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { Dashboard, People, Settings, EmojiEvents, Groups, SportsEsports, SportsMma } from "@mui/icons-material";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const menuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/dashboard" },
    { text: "Tournaments", icon: <EmojiEvents />, path: "/tournaments" },
    { text: "Users", icon: <People />, path: "/users" },
    { text: "Teams", icon: <Groups />, path: "/teams" },
    { text: "Players", icon: <SportsMma />, path: "/players" },
    { text: "Games", icon: <SportsEsports />, path: "/games" },
    { text: "Settings", icon: <Settings />, path: "/settings" }
  ];

  return (
    <Drawer variant="permanent" sx={{ width: 240, flexShrink: 0, '& .MuiDrawer-paper': { width: 240, boxSizing: 'border-box', paddingTop: '64px' } }}>
      <List>
        {menuItems.map((item) => (
          <ListItem 
            button 
            key={item.text} 
            component={Link} 
            to={item.path}
            sx={{ '&:hover': { backgroundColor: '#f0f4fa' } }}
          >
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;