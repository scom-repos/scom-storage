import { Module, customModule, Container, VStack } from '@ijstech/components';
import { ScomStorage } from '@scom/scom-storage';

@customModule
export default class Module1 extends Module {
    constructor(parent?: Container, options?: any) {
        super(parent, options);
    }

    async init() {
        super.init();
    }

    render() {
        return (
            <i-panel width="100%" height="100%">
                <i-scom-storage
                    baseUrl='#/storage'
                    transportEndpoint="http://localhost:8088"
                ></i-scom-storage>
            </i-panel>
        )
    }
}