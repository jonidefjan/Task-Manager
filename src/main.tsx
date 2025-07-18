import ReactDOM from 'react-dom/client';
import { TodoApplication } from './components/organisms/TodoApplication';
import './styles/base.css';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<TodoApplication />);
