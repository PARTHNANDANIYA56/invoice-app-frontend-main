import React, { Suspense, lazy } from "react";
import { Redirect, Switch, Route } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../_metronic/layout";
import { DashboardPage } from "./Dashboard/DashboardPage";
import BankPayment from "./pages/BankPayment/BankPayment";
import Client_list from "./pages/Client/Client_list";
import CreateInvoice from "./pages/Invoice/CreateInvoice/CreateInvoice";
import InvoiceList from "./pages/Invoice/Invoicelist/InvoiceList";
import User from "./pages/User/User";



export default function BasePage() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          /* Redirect from root URL to /dashboard. */
          <Redirect exact from="/" to="/dashboard" />
        }
        <ContentRoute path="/dashboard" component={CreateInvoice} />
        <ContentRoute path="/client_list" component={Client_list} />
        <ContentRoute path="/createinvoice" component={CreateInvoice} />
        <ContentRoute path="/bankpayment" component={BankPayment} />
        <ContentRoute path="/user" component={User} />

        <Redirect to="error/error-v1" />
      </Switch>
    </Suspense>
  );
}
