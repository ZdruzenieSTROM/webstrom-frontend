import StromStaticPage, {seminarBasedGetServerSideProps} from '../strom/[page]'

export default StromStaticPage

export const getServerSideProps = seminarBasedGetServerSideProps('matik')
