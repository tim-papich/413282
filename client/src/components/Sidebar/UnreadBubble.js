import { Chip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  chip: {
    marginRight: 20
  }
}));

const UnreadBubble = ({ unreadCount }) => {
  const classes = useStyles();

  return (
    <>
      {
        unreadCount > 0 && <Chip
          className={classes.chip}
          color="primary"
          label={unreadCount}
          size="small"
        />
      }
    </>
  )
}

export default UnreadBubble;