import * as React from 'react';
import {Pages} from "../state/navigation";
import {InspectorPage} from "./InspectorPage";

export function MainPage(props: {page: Pages}) {

  function renderPage(page: Pages) {
    switch (page) {
      case Pages.Inspector:
        return <InspectorPage />;
      default:
        return <>Invalid page</>;
    }
  }

  const {page} = props;
  return renderPage(page);
}