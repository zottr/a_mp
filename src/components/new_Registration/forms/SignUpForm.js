import { useState } from 'react';
import PrimaryInfoForm from './PrimaryInfoForm';
import SecondaryInfoForm from './SecondaryInfoForm';

function SignUpForm() {
  const [primaryInfoFilled, setPrimaryInfoFilled] = useState(false);
  const [sellerData, setSellerData] = useState({
    sellerName: '',
    businessName: '',
    businessLogo: null,
    businessBanner: null,
    upiID: '',
    upiPhone: '',
    upiName: '',
    upiQR: null,
  });
  return (
    <>
      {!primaryInfoFilled && (
        <PrimaryInfoForm
          setPrimaryInfoFilled={setPrimaryInfoFilled}
          formData={sellerData}
          setFormData={setSellerData}
        />
      )}
      {primaryInfoFilled && (
        <SecondaryInfoForm
          sellerData={sellerData}
          setSellerData={setSellerData}
        />
      )}
    </>
  );
}

export default SignUpForm;
