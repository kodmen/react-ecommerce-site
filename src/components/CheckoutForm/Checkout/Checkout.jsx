import React, { useState, useEffect } from 'react'
import { Paper, Stepper, Step, StepLabel, Typography, CircularProgress, Divider, Button } from "@material-ui/core"

import { commerce } from "../../../lib/commerce"
import useStyles from "./styles";
import AddressForm from "../AddressForm"
import PaymentForm from "../PaymentForm"
import { Link } from "react-router-dom"

const steps = ["Shipping address", "Payment details"];

const Checkout = ({ cart , order, onCaptureCheckout, error}) => {
    const [activeStep, setActiveStep] = useState(0);
    const [checkoutToken, setCheckoutToken] = useState(null);
    const [shippingData, setShippingData] = useState({});
    const classes = useStyles();

    useEffect(() => {
        const generateToken = async () => {
            try{
                const token = await commerce.checkout.generateToken(cart.id, {type: "cart" });
         
                setCheckoutToken(token);

            } catch (error){
                console.log(error);
            }
        }
        generateToken();
    }, [cart]);

    const nextStep = () => setActiveStep((prevActiveStep) => prevActiveStep + 1 );
    const bactStep = () => setActiveStep((prevActiveStep) => prevActiveStep - 1 );

    const next = (data) => {
        setShippingData(data);
        
        nextStep();  
    }

    const Confirmation = () => order.customer ? (
        <>
        <div>
            <Typography variant="h5">Thank you for your pruchase, {order.customer.firstname} {order.customer.lastname}</Typography>
            <Divider className={classes.divider} />
            <Typography variant="subtitle2">Order ref: {order.customer_refrence}</Typography>
        </div>
        <br />
        <Button component={Link} to="/" variant="outlined" type="button">Back to Home</Button>
        </>
    ): (
        <div className={classes.spinner}>
            <CircularProgress />
        </div>
    );

    if(error){
        <>
        <Typography variant="h5">Error: {error} </Typography>
        <br />
        <Button comyonent={Link} to="/" variant="outlined" type="button">Bact to Home</Button>
        </>
    }


    const test = (data) => {
        setShippingData(data);

        nextStep();
    }

    const Form = () => activeStep === 0
        ? <AddressForm checkoutToken={checkoutToken} next={next} test={test}/>
        : <PaymentForm shippingData={shippingData} checkoutToken={checkoutToken} bactStep={bactStep} nextStep={nextStep} onCaptureCheckout={onCaptureCheckout}/>


    return (
        <>
           <div className={classes.toolbar} />
           <main className={classes.layout}  >
               <Paper className={classes.paper}>
                   <Typography variant="h4" align="center">Checkout</Typography>
                    <Stepper activeStep={activeStep} className={classes.stepper}>
                        {steps.map((step) => (
                            <Step key={step}>
                                <StepLabel>{step}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    {activeStep === steps.length ? <Confirmation /> : checkoutToken && <Form /> }
               </Paper>
           </main>
        </>
    )
}

export default Checkout
