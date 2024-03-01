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
                    cid="bafybeigqp3wtqc3csdjxoxhmifpqzpa5m6kex6i3mik6cyei2pdeyev2o4"
                    transportEndpoint="http://localhost:8088"
                ></i-scom-storage>
            </i-panel>
        )
    }
}