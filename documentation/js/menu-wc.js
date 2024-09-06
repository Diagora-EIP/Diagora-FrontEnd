'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">front-end documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-AppModule-1afdd6fe489f210b6d3919320b505f498f3866d4091cc9a70db408b127a3db5a49b3b16e9a830ec0786ffd36ea1b0ce7db9418ca0969a12deb259ce15e15fc3c"' : 'data-bs-target="#xs-components-links-module-AppModule-1afdd6fe489f210b6d3919320b505f498f3866d4091cc9a70db408b127a3db5a49b3b16e9a830ec0786ffd36ea1b0ce7db9418ca0969a12deb259ce15e15fc3c"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-1afdd6fe489f210b6d3919320b505f498f3866d4091cc9a70db408b127a3db5a49b3b16e9a830ec0786ffd36ea1b0ce7db9418ca0969a12deb259ce15e15fc3c"' :
                                            'id="xs-components-links-module-AppModule-1afdd6fe489f210b6d3919320b505f498f3866d4091cc9a70db408b127a3db5a49b3b16e9a830ec0786ffd36ea1b0ce7db9418ca0969a12deb259ce15e15fc3c"' }>
                                            <li class="link">
                                                <a href="components/AddClientComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AddClientComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AddCommandComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AddCommandComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AddVehiculeComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AddVehiculeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AlertComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AlertComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AppComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CarteComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CarteComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ClientComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ClientComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CommandsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CommandsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CompanyCreateModalComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CompanyCreateModalComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CompanyUpdateModalComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CompanyUpdateModalComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ConfirmModalComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ConfirmModalComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CreateScheduleModalComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CreateScheduleModalComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DelivererAbsenceModalComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DelivererAbsenceModalComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DetailsCommandComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DetailsCommandComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DetailsVehiculeComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DetailsVehiculeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditClientComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditClientComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditCommandComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditCommandComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditVehiculeComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditVehiculeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditVehiculeExpenseComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditVehiculeExpenseComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FilterBarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FilterBarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ForgotPasswordComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ForgotPasswordComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LoadingSpinnerComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoadingSpinnerComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LockVehicleComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LockVehicleComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LoginComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoginComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ManagerComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ManagerComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ManagerGestionClientComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ManagerGestionClientComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ManagerToolsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ManagerToolsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ManagerUserCreateModalComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ManagerUserCreateModalComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ManagerUserListComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ManagerUserListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ManagerUserUpdateModalComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ManagerUserUpdateModalComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ManagerUserVehicleUpdateModalComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ManagerUserVehicleUpdateModalComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MapComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MapComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NavbarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NavbarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NotificationComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NotificationComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NotificationShowModalComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NotificationShowModalComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/OrderBarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OrderBarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProfileComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProfileComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PropositionComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PropositionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RegisterComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RegisterComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ResetPasswordComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ResetPasswordComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ScheduleComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ScheduleComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StatisticComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StatisticComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UpdateScheduleModalComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UpdateScheduleModalComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UserCreateModalComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserCreateModalComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UserListComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UserUpdateModalComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserUpdateModalComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/VehicleExpenseCreateModalComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VehicleExpenseCreateModalComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/VehiculeComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VehiculeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/VisualizeScheduleDayComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VisualizeScheduleDayComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/WebsocketComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WebsocketComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/WebsocketDialogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WebsocketDialogComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link" >AppRoutingModule</a>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/CompanyInfos.html" data-type="entity-link" >CompanyInfos</a>
                            </li>
                            <li class="link">
                                <a href="classes/Roles.html" data-type="entity-link" >Roles</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserInfos.html" data-type="entity-link" >UserInfos</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserM.html" data-type="entity-link" >UserM</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserWithCompany.html" data-type="entity-link" >UserWithCompany</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserWithoutPassword.html" data-type="entity-link" >UserWithoutPassword</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AbsenceService.html" data-type="entity-link" >AbsenceService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AdminService.html" data-type="entity-link" >AdminService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ApiService.html" data-type="entity-link" >ApiService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthGuard.html" data-type="entity-link" >AuthGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthLeftGuard.html" data-type="entity-link" >AuthLeftGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ClientService.html" data-type="entity-link" >ClientService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CommandsService.html" data-type="entity-link" >CommandsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ConfirmModalService.html" data-type="entity-link" >ConfirmModalService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DestroyService.html" data-type="entity-link" >DestroyService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FollowUpService.html" data-type="entity-link" >FollowUpService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ItineraryService.html" data-type="entity-link" >ItineraryService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ManagerService.html" data-type="entity-link" >ManagerService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NotificationService.html" data-type="entity-link" >NotificationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/OrderService.html" data-type="entity-link" >OrderService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PermissionsService.html" data-type="entity-link" >PermissionsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PropositionService.html" data-type="entity-link" >PropositionService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ScheduleService.html" data-type="entity-link" >ScheduleService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SecurityService.html" data-type="entity-link" >SecurityService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SnackbarService.html" data-type="entity-link" >SnackbarService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/StatisticService.html" data-type="entity-link" >StatisticService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TeamService.html" data-type="entity-link" >TeamService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserService.html" data-type="entity-link" >UserService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UtilsService.html" data-type="entity-link" >UtilsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/VehiculesService.html" data-type="entity-link" >VehiculesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/WebsocketService.html" data-type="entity-link" >WebsocketService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/DialogData.html" data-type="entity-link" >DialogData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/User.html" data-type="entity-link" >User</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WebSocketClientPacket.html" data-type="entity-link" >WebSocketClientPacket</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WebSocketClientPacketAction.html" data-type="entity-link" >WebSocketClientPacketAction</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WebSocketClientPacketAuth.html" data-type="entity-link" >WebSocketClientPacketAuth</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WebSocketClientPacketClose.html" data-type="entity-link" >WebSocketClientPacketClose</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WebSocketServerPacket.html" data-type="entity-link" >WebSocketServerPacket</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WebSocketServerPacketEvent.html" data-type="entity-link" >WebSocketServerPacketEvent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WebSocketServerPacketResponse.html" data-type="entity-link" >WebSocketServerPacketResponse</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});