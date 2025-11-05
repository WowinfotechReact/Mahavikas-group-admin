import { useState, useEffect, useRef } from "react";
import {
      Dialog, DialogTitle, DialogContent, DialogActions, Grid,
      Button, Checkbox, FormControlLabel, List, ListItem, Typography
} from "@mui/material";

function SerialNoModal({ open, onClose, product, productSerials, setProductSerials }) {
      // Hooks must always be called
      const [errorMsg, setErrorMsg] = useState("");
      const errorRef = useRef(null);

      const assigned = product ? productSerials[product.invoiceProductMapID] || [] : [];
      const maxQty = product ? product.quantity || 0 : 0;

      const toggleSerial = (serialObj) => {
            const id = serialObj.salesProductSerID;
            let updated;

            if (assigned.some((s) => s.salesProductSerID === id)) {
                  // Remove if already selected
                  updated = assigned.filter((s) => s.salesProductSerID !== id);
            } else {
                  // Add if under maxQty
                  if (assigned.length >= maxQty) {
                        setErrorMsg(`You can assign only ${maxQty} serial numbers`);
                        return;
                  }
                  updated = [...assigned, serialObj];
            }

            setProductSerials((prev) => ({
                  ...prev,
                  [product.invoiceProductMapID]: updated,
            }));
            setErrorMsg("");
      };


      const handleDone = () => {
            if (assigned.length !== maxQty) {
                  setErrorMsg(`You must select exactly ${maxQty} serial numbers`);
                  return;
            }
            onClose();
      };

      useEffect(() => {
            if (open) setErrorMsg("");
      }, [open]);

      useEffect(() => {
            if (errorMsg && errorRef.current) {
                  errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
            }
      }, [errorMsg]);

      return (
            <Dialog open={open} onClose={(event, reason) => {
                  if (reason !== "backdropClick") {
                        onClose(event, reason); // allow only escape key or programmatic close
                  }
            }} hideBackdrop={false} maxWidth="sm" fullWidth>
                  {product && (
                        <>
                              <DialogTitle>
                                    Assign Serial Numbers - {product.productName} (Select exactly {maxQty})
                              </DialogTitle>

                              <DialogContent dividers>
                                    {errorMsg && (
                                          <Typography
                                                color="error"
                                                variant="body1"
                                                align="center"
                                                sx={{ mb: 2 }}
                                                ref={errorRef}
                                          >
                                                {errorMsg}
                                          </Typography>
                                    )}

                                    <Grid container spacing={2}>
                                          {product.soSerialMappingList?.map((s) => (
                                                <Grid item xs={12} sm={4} key={s.salesProductSerID}>
                                                      <FormControlLabel
                                                            control={
                                                                  <Checkbox
                                                                        checked={assigned.some(
                                                                              (a) => a.salesProductSerID === s.salesProductSerID
                                                                        )}
                                                                        onChange={() => toggleSerial(s)}
                                                                  />
                                                            }
                                                            label={`Serial No: ${s.serialNumber} (ID: ${s.salesProductSerID})`}
                                                      />
                                                </Grid>
                                          ))}
                                    </Grid>
                              </DialogContent>


                              <DialogActions>
                                    <button onClick={handleDone} className="text-white btn " style={{ background: '#9aa357' }} >
                                          Done
                                    </button>
                              </DialogActions>
                        </>
                  )
                  }
            </Dialog >
      );
}

export default SerialNoModal;
