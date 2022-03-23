import { Badge } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  badge: {
    marginRight: '40px'
  }
}));

const UnreadBubble = ({ unreadCount }) => {
  const classes = useStyles();
  
  return (
    <>
      <Badge
        className={classes.badge}
        color="primary"
        badgeContent={unreadCount}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      />
    </>
  )
}

export default UnreadBubble;