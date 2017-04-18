import { PageProps } from './components';

interface GlobaValue extends PageProps<any> {

}

let val: GlobaValue = {
    url: '',
    goBack: null,
    jump: null,
    query: null
}

export default val;