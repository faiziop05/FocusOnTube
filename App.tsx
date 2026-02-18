import { Provider } from "react-redux";
import { Container } from "./app/navigations/Stack";
import { store } from "./app/redux/store";

export default function App() {
  return (
    <Provider store={store}>
      <Container />
    </Provider>
  );
}
