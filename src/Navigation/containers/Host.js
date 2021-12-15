import React from "react";
import "../Host/styles/Authenticated.scss";

import { Grid } from "semantic-ui-react";
import { Routes } from "../Host/components/Routes";
import { BrowserRouter as Router } from "react-router-dom";
import { SideBar } from "../Host/components/SideBar";
import { TopBar } from "../Host/components/TopBar";

export function Host(props) {
  const { user, userFromFirestore } = props;
  return (
    <Router>
      <Grid className="logged-layout">
        <Grid.Row>
          <Grid.Column width={3} height={100}>
            <SideBar user={user} />
          </Grid.Column>
          <Grid.Column className="content" width={13}>
            <TopBar user={user} />
            <Routes user={user} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Router>
  );
}
