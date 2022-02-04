import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function ExportDialog({ exportSQLs, open, onClose }) {
  const handleClose = () => {
    onClose();
  };

  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  const handleCopyClick = () => {
    let sql = exportSQLs.join("\n\n");
    navigator.clipboard.writeText(sql);
  };

  return (
    <div>
      <Dialog
        maxWidth="lg"
        open={open}
        onClose={handleClose}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">Export SQL</DialogTitle>
        <DialogContent dividers>
          {exportSQLs.map((sql, index) => (
            <DialogContentText key={index} gutterBottom>
              {sql}
            </DialogContentText>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCopyClick}>Copy</Button>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
