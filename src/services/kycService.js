import axios from "axios";
import sharedData from './aa_sharedData';

const { baseURL } = sharedData;

class KycService {
  async submitKyc(formData) {
    const url = `${baseURL}/api/kyc/submitKyc`;
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const response = await axios.post(url, formData, config);
      return response;
    } catch (error) {
      console.error('Error in submitting KYC:', error);
      throw error;
    }
  }
}

const kycService = new KycService();
export default kycService;
