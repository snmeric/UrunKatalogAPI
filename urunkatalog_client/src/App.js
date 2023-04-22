import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Product from './components/Product';

function App(Component) {
  return (
    <NextUIProvider>
      <Component />
      <Product/>
    </NextUIProvider>
  );
}

export default App;
