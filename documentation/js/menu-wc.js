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
                    <a href="index.html" data-type="index-link">splace-client documentation</a>
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
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#components-links"' :
                            'data-bs-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/AboutAppComponent.html" data-type="entity-link" >AboutAppComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AddUserComponent.html" data-type="entity-link" >AddUserComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AppComponent.html" data-type="entity-link" >AppComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ChangePasswordComponent.html" data-type="entity-link" >ChangePasswordComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ChangeRoleComponent.html" data-type="entity-link" >ChangeRoleComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ChangeStatusComponent.html" data-type="entity-link" >ChangeStatusComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ChangeUsernameComponent.html" data-type="entity-link" >ChangeUsernameComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ChatComponent.html" data-type="entity-link" >ChatComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CreatedGroupsComponent.html" data-type="entity-link" >CreatedGroupsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CreatedQuizzesComponent.html" data-type="entity-link" >CreatedQuizzesComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CreateGroupComponent.html" data-type="entity-link" >CreateGroupComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CreateQuizComponent.html" data-type="entity-link" >CreateQuizComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DeleteAccountComponent.html" data-type="entity-link" >DeleteAccountComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DeleteGroupComponent.html" data-type="entity-link" >DeleteGroupComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DeleteQuizComponent.html" data-type="entity-link" >DeleteQuizComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditQuizComponent.html" data-type="entity-link" >EditQuizComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/GroupComponent.html" data-type="entity-link" >GroupComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/GroupMainComponent.html" data-type="entity-link" >GroupMainComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/GroupNameComponent.html" data-type="entity-link" >GroupNameComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/GroupOptionsComponent.html" data-type="entity-link" >GroupOptionsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/GroupTabsComponent.html" data-type="entity-link" >GroupTabsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/GroupUtilitiesComponent.html" data-type="entity-link" >GroupUtilitiesComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/HomeComponent.html" data-type="entity-link" >HomeComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LeaveGroupComponent.html" data-type="entity-link" >LeaveGroupComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LoginComponent.html" data-type="entity-link" >LoginComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LogOutComponent.html" data-type="entity-link" >LogOutComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MainComponent.html" data-type="entity-link" >MainComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MessageComponent.html" data-type="entity-link" >MessageComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/NotFoundComponent.html" data-type="entity-link" >NotFoundComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ParticipantsComponent.html" data-type="entity-link" >ParticipantsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/QuizComponent.html" data-type="entity-link" >QuizComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/QuizListComponent.html" data-type="entity-link" >QuizListComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/RegistrationComponent.html" data-type="entity-link" >RegistrationComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/RemoveUserComponent.html" data-type="entity-link" >RemoveUserComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/RenameGroupComponent.html" data-type="entity-link" >RenameGroupComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ScoresComponent.html" data-type="entity-link" >ScoresComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UserMenuComponent.html" data-type="entity-link" >UserMenuComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UserScoresComponent.html" data-type="entity-link" >UserScoresComponent</a>
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
                                <a href="classes/QuizValidators.html" data-type="entity-link" >QuizValidators</a>
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
                                    <a href="injectables/ApplicationHubService.html" data-type="entity-link" >ApplicationHubService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GroupDataService.html" data-type="entity-link" >GroupDataService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GroupsService.html" data-type="entity-link" >GroupsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MessagesService.html" data-type="entity-link" >MessagesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MyErrorHandlerService.html" data-type="entity-link" >MyErrorHandlerService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/QuizzesService.html" data-type="entity-link" >QuizzesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UsersDataService.html" data-type="entity-link" >UsersDataService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UsersService.html" data-type="entity-link" >UsersService</a>
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
                                <a href="interfaces/AddUserRequest.html" data-type="entity-link" >AddUserRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AnswerDto.html" data-type="entity-link" >AnswerDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ChangePasswordRequest.html" data-type="entity-link" >ChangePasswordRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ChangeRoleRequest.html" data-type="entity-link" >ChangeRoleRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ChangeStatusRequest.html" data-type="entity-link" >ChangeStatusRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ChangeUsernameRequest.html" data-type="entity-link" >ChangeUsernameRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CreateAnswerDto.html" data-type="entity-link" >CreateAnswerDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CreateGroupRequest.html" data-type="entity-link" >CreateGroupRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CreateQuestionDto.html" data-type="entity-link" >CreateQuestionDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CreateQuizDto.html" data-type="entity-link" >CreateQuizDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CreateQuizRequest.html" data-type="entity-link" >CreateQuizRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CustomPopUpForm.html" data-type="entity-link" >CustomPopUpForm</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DeleteMessageRequest.html" data-type="entity-link" >DeleteMessageRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DeleteQuizRequest.html" data-type="entity-link" >DeleteQuizRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GroupDto.html" data-type="entity-link" >GroupDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GroupIdentifier.html" data-type="entity-link" >GroupIdentifier</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MessageDto.html" data-type="entity-link" >MessageDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/QuestionDto.html" data-type="entity-link" >QuestionDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/QuizDto.html" data-type="entity-link" >QuizDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/QuizIdentifier.html" data-type="entity-link" >QuizIdentifier</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/QuizScores.html" data-type="entity-link" >QuizScores</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RemoveUserRequest.html" data-type="entity-link" >RemoveUserRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RenameGroupRequest.html" data-type="entity-link" >RenameGroupRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SaveMessageRequest.html" data-type="entity-link" >SaveMessageRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SubmitQuizRequest.html" data-type="entity-link" >SubmitQuizRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserAccount.html" data-type="entity-link" >UserAccount</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserGroupRequest.html" data-type="entity-link" >UserGroupRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserPublicData.html" data-type="entity-link" >UserPublicData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserScore.html" data-type="entity-link" >UserScore</a>
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
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
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