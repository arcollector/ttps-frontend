import React from "react";
import { Segment, Header, Icon, Button } from "semantic-ui-react";
import { useHistory } from "react-router-dom";

export function NotFound() {
  const history = useHistory();
  const goBack = React.useCallback(() => {
    history.goBack();
  }, [history]);

  return (
    <Segment placeholder>
      <Header icon>
        <Icon name="attention" />
        Pagina no encontrada
      </Header>
      <Button secondary onClick={goBack}>
        Volver
      </Button>
    </Segment>
  );
}
