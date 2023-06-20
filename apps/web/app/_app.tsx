import '../styles/globals.css';
import { AppProps } from 'next/app';
import { VerifyAndUpload } from '../../verify/contract-verify/verifyAndUpload';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <VerifyAndUpload />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
