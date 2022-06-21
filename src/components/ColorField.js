import React, { Fragment, FunctionComponent } from "react";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import IconButton from "@mui/material/IconButton";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import Color from "color";
import { ChromePicker } from "react-color";

export const ColorField = ({ label, fullWidth, value, onChange }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openPicker, setOpenPicker] = React.useState(false);
  const [color, setColor] = React.useState(Color(value));

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpenPicker(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpenPicker(false);
    onChange(color.hex());
  };

  const renderButton = () => {
    if (!label) {
      return (
        <IconButton aria-label="color" size="small" onClick={handleClick}>
          <ColorLensIcon fontSize="inherit" style={{ color: color.hex() }} />
        </IconButton>
      );
    } else {
      return (
        <Button
          variant="outlined"
          size="small"
          startIcon={<ColorLensIcon style={{ color: color.hex() }} />}
          fullWidth={fullWidth}
          onClick={handleClick}
        >
          {label}
        </Button>
      );
    }
  };

  React.useEffect(() => {
    setColor(Color(value));

    return () => {};
  }, [value]);

  return (
    <Fragment>
      {renderButton()}
      <Popover
        open={openPicker}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <ChromePicker
          color={color.hex()}
          onChange={(e) => setColor(Color(e.hex))}
        />
      </Popover>
    </Fragment>
  );
};
