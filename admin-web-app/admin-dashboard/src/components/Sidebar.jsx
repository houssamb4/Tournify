import { Drawer, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { Dashboard, People, Settings } from "@mui/icons-material";

export const Sidebar = () => (
  <Drawer variant="permanent" sx={{ width: 240 }}>
    <List>
      {["Dashboard", "Users", "Settings"].map((text, index) => (
        <ListItem button key={text}>
          <ListItemIcon>
            {index === 0 ? <Dashboard /> : index === 1 ? <People /> : <Settings />}
          </ListItemIcon>
          <ListItemText primary={text} />
        </ListItem>
      ))}
    </List>
  </Drawer>
);