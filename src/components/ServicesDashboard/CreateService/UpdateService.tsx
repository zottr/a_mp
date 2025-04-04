import { useParams } from 'react-router-dom';
import AddOrUpdateService from './AddOrUpdateService';

function UpdateService() {
  const params = useParams();
  return <AddOrUpdateService productToEditId={params.serviceId} />;
}

export default UpdateService;
