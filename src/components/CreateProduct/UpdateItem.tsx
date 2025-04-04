import { useParams } from 'react-router-dom';
import AddOrUpdateItem from './AddOrUpdateItem';

function UpdateItem() {
  const params = useParams();
  return <AddOrUpdateItem productToEditId={params.productId} />;
}

export default UpdateItem;
