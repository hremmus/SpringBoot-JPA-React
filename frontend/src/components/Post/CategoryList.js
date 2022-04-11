import { List, ListItem, ListItemText, makeStyles } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: "120ch",
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

const CategoryItem = ({
  category,
  selectedIndex,
  handleListItemClick,
  classes,
}) => {
  return (
    <>
      <ListItem
        button
        component={Link}
        children={category.children}
        to={`/posts?categoryId=${category.id}&page=0&size=20`}
        selected={selectedIndex === category.id}
        onClick={(event) => handleListItemClick(event, category.id)}
      >
        <ListItemText primary={category.name} />
      </ListItem>
      {category.children.map((child) => (
        <ListItem
          key={child.id}
          button
          component={Link}
          to={`/posts?categoryId=${child.id}&page=0&size=20`}
          selected={selectedIndex === child.id}
          onClick={(event) => handleListItemClick(event, child.id)}
          className={classes.nested}
        >
          <ListItemText primary={child.name} />
        </ListItem>
      ))}
    </>
  );
};

const CategoryList = ({ categories }) => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <List component="div" aria-label="main mailbox folders">
        <ListItem
          button
          component={Link}
          to={`/posts?page=0&size=20`}
          selected={selectedIndex === 0}
          onClick={(event) => handleListItemClick(event, 0)}
        >
          <ListItemText primary="전체" />
        </ListItem>
        {categories.map((category) => (
          <li key={category.id}>
            {/* ListItem이 li이 아닌 a 태그로 쓰이고 있기 때문에 key props를 읽지 못함. key를 부여하기 위해 감싸줌 */}
            <CategoryItem
              category={category}
              selectedIndex={selectedIndex}
              handleListItemClick={handleListItemClick}
              classes={classes}
            />
          </li>
        ))}
      </List>
    </div>
  );
};

export default CategoryList;
