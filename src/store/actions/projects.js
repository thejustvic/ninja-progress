import { API } from './instance'
import axios from 'axios'
import { API_URL } from '../../config'
import {
  GET_ALL_PROJECTS,
  GET_ALL_PROJECTS_SUCCESS,
  GET_ALL_PROJECTS_FAILURE,
  CREATE_PROJECT,
  CREATE_PROJECT_SUCCESS,
  CREATE_PROJECT_FAILURE,
  DELETE_PROJECT,
  DELETE_PROJECT_SUCCESS,
  DELETE_PROJECT_FAILURE,

} from './types/index';
import { push } from 'connected-react-router'


export function getAllProjects() {
  return function (dispatch) {
    API.get(`project`)
      .then(response => {
        dispatch({ type: 'RESET_ALL_PROJECTS' });
        // console.log('getAllProjects: ', response.data)
        dispatch({
          type: GET_ALL_PROJECTS,
          payload: response.data.data
        });
        dispatch({
          type: 'GET_ALL_PROJECTS_LIMIT',
          payload: response.data.limit
        });
        dispatch({ type: GET_ALL_PROJECTS_SUCCESS });
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response)
          dispatch({
            type: GET_ALL_PROJECTS_FAILURE,
            payload: error.response.data.error
          });
        }
      });
  }
}

export const updateProjectsBySearch = updateProjects => dispatch => {
  dispatch({ type: GET_ALL_PROJECTS, payload: updateProjects });
}

export function getAllTemplates() {
  return function (dispatch) {
    API.get(`template`)
      .then(response => {

        dispatch({
          type: 'GET_ALL_TEMPLATES',
          payload: response.data.data
        });
        dispatch({ type: 'GET_ALL_TEMPLATES_SUCCESS' });
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response)
          dispatch({
            type: GET_ALL_PROJECTS_FAILURE,
            payload: error.response.data.error
          });
        }
      });
  }
}

export function deleteProjectByUserId(id) {
  return function (dispatch) {
    API.delete(`project/${id}`)
      .then(() => {
        dispatch({
          type: DELETE_PROJECT,
          payload: id
        });
        dispatch({ type: DELETE_PROJECT_SUCCESS });
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response)
          dispatch({
            type: DELETE_PROJECT_FAILURE,
            payload: error.response.data.error
          });
        }
      });
  }
}

export function createProject(projectName) {
  return function (dispatch) {
    API.post(`project`, {
      'projectName': projectName,
    })
      .then(response => {
        if (response.data) {
          // console.log('createProject: ', response.data)
          dispatch({
            type: CREATE_PROJECT,
            payload: response.data.data
          });
          dispatch({ type: CREATE_PROJECT_SUCCESS });
          dispatch(push('/'));
        }

      })
      .catch(function (error) {
        if (error.response) {
          console.log('error.response: ', error.response)
          dispatch({
            type: CREATE_PROJECT_FAILURE,
            payload: error.response.data.error
          });
        }
      });
  }
}

export function createFunnel(projectName, projectId) {
  return function (dispatch) {
    API.post(`funnel/${projectId}`, {
      'funnelName': projectName,
    })
      .then(response => {
        if (response.data) {
          let res = response.data.data

          dispatch({
            type: 'CREATE_FUNNEL',
            payload: {
              projectId,
              res,
            }
          });
          dispatch({ type: 'CREATE_FUNNEL_SUCCESS' });
        }

      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response)
          dispatch({
            type: 'CREATE_FUNNEL_FAILURE',
            payload: error.response.data.error
          });
        }
      });
  }
}

export function getAllFunnels(projectId) {
  return function (dispatch) {
    API.get(`funnel/${projectId}`)
      .then(response => {
        let res = response.data.data;
        let limit = response.data.limit;
        // console.log('getAllFunnels: ', response.data)
        dispatch({
          type: 'RESET_ALL_FUNNELS',
          payload: {
            projectId
          }
        });
        dispatch({
          type: 'GET_ALL_FUNNELS',
          payload: {
            projectId,
            res,
          }
        });
        dispatch({
          type: 'GET_ALL_FUNNELS_LIMIT',
          payload: {
            projectId,
            limit,
          }
        });
        dispatch({ type: 'GET_ALL_FUNNELS_SUCCESS' });
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response)
          dispatch({
            type: 'GET_ALL_FUNNELS_FAILURE',
            payload: error.response.data.error
          });
        }
      });
  }
}

export function deleteFunnel(project_id, funnel_id) {
  return function (dispatch) {
    API.delete(`funnel/${project_id}/${funnel_id}`)
      .then(() => {
        dispatch({
          type: 'DELETE_FUNNEL',
          payload: {
            project_id,
            funnel_id
          }
        });
        dispatch({ type: 'DELETE_FUNNEL_SUCCESS' });
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response)
          alert(error.response.data.message)
          dispatch({
            type: 'DELETE_FUNNEL_FAILURE',
            payload: error.response.data.message
          });
        }
      });
  }
}

export function deleteTemplate(template_id) {
  return function (dispatch) {
    API.delete(`template/${template_id}`)
      .then(() => {
        dispatch({
          type: 'DELETE_TEMPLATE',
          payload: template_id,
        });
        dispatch({ type: 'DELETE_TEMPLATE_SUCCESS' });
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response)
          alert(error.response.data.message)
          dispatch({
            type: 'DELETE_TEMPLATE_FAILURE',
            payload: error.response.data.message
          });
        }
      });
  }
}

export function createLink(funnelsId, permissions) {
  return function (dispatch) {
    API.post(`funnel/url`, {
      'funnelsId': funnelsId,
      'permissions': permissions,
    })
      .then(response => {
        dispatch({
          type: 'CREATE_LINK',
          payload: response.data.data
        });
        dispatch({ type: 'CREATE_LINK_SUCCESS' });
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response)
          dispatch({
            type: 'CREATE_LINK_FAILURE',
            payload: error.response.data.error
          });
        }
      });
  }
}

export const resetLink = () => dispatch => {
  dispatch({ type: 'CREATE_LINK_RESET' });
}

export function createTemplate(funnelId, templateName) {
  // console.log(funnelId, templateName)
  return function (dispatch) {
    API.post(`template/${funnelId}`, {
      'templateName': templateName
    })
      .then(response => {
        // console.log('createTemplate: ', response.data)
        dispatch({
          type: 'CREATE_TEMPLATE_SUCCESS',
          payload: response.data.message
        });

        setTimeout(() => {
          dispatch({ type: 'CREATE_TEMPLATE_RESET' });
        }, 2000)
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response)
          dispatch({
            type: 'CREATE_TEMPLATE_FAILURE',
            payload: error.response.data.error
          });
        }
      });
  }
}

export function saveDiagramThenCreateTemplate(funnelId, diagramObj, image, templateName) {
  const token = JSON.parse(localStorage.getItem('token'));
  let bodyFormData = new FormData();
  bodyFormData.append('funnelBackground', image);
  bodyFormData.append('funnelBody', JSON.stringify(diagramObj));

  return function (dispatch) {
    axios({
      method: 'patch',
      url: `${API_URL}/funnel/diagram/${funnelId}`,
      headers: {
        'authorization': token,
        'Content-Type': 'form-data'
      },
      data: bodyFormData
    })
      .then(response => {

        let res1 = JSON.parse(response.data.data.funnelBody);
        let res = {
          converted: res1.converted,
          snackMsg: 'next'
        }
        dispatch({
          type: 'GET_DIAGRAM',
          payload: {
            funnelId,
            res,
          }
        });
        dispatch({
          type: 'SAVE_DIAGRAM_SUCCESS',
          payload: response.data.message
        });

        setTimeout(() => {
          dispatch({ type: 'SAVE_DIAGRAM_SUCCESS_RESET' });
        }, 1000)

        return API.post(`template/${funnelId}`, { 'templateName': templateName })
      })

      .then(response => {
        // console.log('createTemplate: ', response.data)
        dispatch({
          type: 'CREATE_TEMPLATE_SUCCESS',
          payload: response.data.message
        });

        setTimeout(() => {
          dispatch({ type: 'CREATE_TEMPLATE_RESET' });
        }, 2000)
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response)
          dispatch({
            type: 'CREATE_DIAGRAM_FAILURE',
            payload: error.response.data.error
          });
        }
      });
  }
}

export const saveDiagramThenExit = (funnelId, diagramObj, image) => dispatch => {

  const token = JSON.parse(localStorage.getItem('token'));
  let bodyFormData = new FormData();
  bodyFormData.append('funnelBackground', image);
  bodyFormData.append('funnelBody', JSON.stringify(diagramObj));

  axios({
    method: 'patch',
    url: `${API_URL}/funnel/diagram/${funnelId}`,
    headers: {
      'authorization': token,
      'Content-Type': 'form-data'
    },
    data: bodyFormData
  })
    .then(response => {

      let res1 = JSON.parse(response.data.data.funnelBody);
      let res = {
        converted: res1.converted,
        snackMsg: 'next'
      }
      dispatch({
        type: 'GET_DIAGRAM',
        payload: {
          funnelId,
          res,
        }
      });
      dispatch({
        type: 'SAVE_DIAGRAM_SUCCESS',
        payload: response.data.message
      });
      setTimeout(() => {
        dispatch({ type: 'SAVE_DIAGRAM_SUCCESS_RESET' });
      }, 1000)
      setTimeout(() => {
        dispatch(push('/'));
      }, 1000)

    })
    .catch(function (error) {
      if (error.response) {
        console.log(error.response)
        dispatch({
          type: 'CREATE_DIAGRAM_FAILURE',
          payload: error.response.data.error
        });
      }
    });
}



export function saveDiagram(funnelId, diagramObj, image) {
  const token = JSON.parse(localStorage.getItem('token'));

  let bodyFormData = new FormData();
  bodyFormData.append('funnelBackground', image);
  bodyFormData.append('funnelBody', JSON.stringify(diagramObj));

  return function (dispatch) {
    axios({
      method: 'patch',
      url: `${API_URL}/funnel/diagram/${funnelId}`,
      headers: {
        'authorization': token,
        'Content-Type': 'form-data'
      },
      data: bodyFormData
    })
      .then(response => {
        // console.log("saveDiagram: ", response.data)
        let res1 = JSON.parse(response.data.data.funnelBody);

        // console.log('res1: ', res1)
        let res = {
          converted: res1.converted,
          snackMsg: 'next'
        }

        dispatch({
          type: 'GET_DIAGRAM',
          payload: {
            funnelId,
            res,
          }
        });
        /************************************/








        dispatch({
          type: 'SAVE_DIAGRAM_SUCCESS',
          payload: response.data.message
        });

        setTimeout(() => {
          dispatch({ type: 'SAVE_DIAGRAM_SUCCESS_RESET' });
        }, 1000)











      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response)
          dispatch({
            type: 'CREATE_DIAGRAM_FAILURE',
            payload: error.response.data.error
          });
        }
      });
  }
}

export function saveTemplate(funnelId, diagramObj) {
  return function (dispatch) {
    API.patch(`template/update/${funnelId}`, {
      'templateBody': JSON.stringify(diagramObj)
    })
      .then(response => {
        // console.log('saveTemplate: ', response.data)
        /************************************/

        let res1 = JSON.parse(response.data.data.templateBody);
        let res = {
          converted: res1.converted,
          snackMsg: 'next'
        }

        dispatch({
          type: 'GET_DIAGRAM',
          payload: {
            funnelId,
            res,
          }
        });
        /************************************/
        dispatch({
          type: 'SAVE_DIAGRAM_SUCCESS',
          payload: response.data.message
        });

        setTimeout(() => {
          dispatch({ type: 'SAVE_DIAGRAM_SUCCESS_RESET' });
        }, 1000)

      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response)
          dispatch({
            type: 'CREATE_DIAGRAM_FAILURE',
            payload: error.response.data.error
          });
        }
      });
  }
}

export const resetMessageUpdateDiagram = () => dispatch => {
  dispatch({ type: 'SAVE_DIAGRAM_SUCCESS_RESET' });
}

export function createNewProjectWithTemplate(templateId, projectName, funnelId) {
  // console.log(templateId, projectName)
  return function (dispatch) {
    API.post(`funnel/template/${templateId}`, {
      'projectName': projectName
    })
      .then(response => {
        // console.log(response.data)
        dispatch({
          type: 'CREATE_NEW_PROJECT_WITH_TEMPLATE_SUCCESS',
          payload: response.data.message
        });

        setTimeout(() => {
          dispatch({ type: 'CREATE_NEW_PROJECT_WITH_TEMPLATE_RESET' });
        }, 2000)

        setTimeout(() => {
          dispatch(push(`/`));
        }, 1000)

      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response)
          dispatch({
            type: 'SAVE_TEMPLATE_FAILURE',
            payload: error.response.data.error
          });
        }
      });
  }
}

export function getDiagram(funnelId) {
  // console.log('getDiagram funnelId: ', funnelId)
  return function (dispatch) {
    API.get(`funnel/diagram/${funnelId}`)
      .then(response => {
        // console.log('getDiagram response: ', response.data)


        let res = {}

        if (response.data.data.funnelBody) {
          res = JSON.parse(response.data.data.funnelBody);
          res['funnelName'] = response.data.data.funnelName;
        }
        else {
          res = {
            funnelName: response.data.data.funnelName,
            snackMsg: 'next'
          };
        }

        // console.log('getDiagram res: ', res)
        dispatch({
          type: 'GET_DIAGRAM',
          payload: {
            funnelId,
            res,
          }
        });
        dispatch({ type: 'GET_DIAGRAM_SUCCESS' });
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response)
          dispatch({
            type: 'GET_DIAGRAM_FAILURE',
            payload: error.response.data.error
          });
        }
      });
  }
}

export function getTemplate(funnelId) {
  // console.log('getDiagram funnelId: ', funnelId)
  return function (dispatch) {
    API.get(`template/${funnelId}`)
      .then(response => {
        // console.log('getTemplate response: ', response.data)

        let res = {}

        if (response.data.data.templateBody) {
          res = JSON.parse(response.data.data.templateBody);
          res['funnelName'] = response.data.data.templateName;
        }
        else {
          res = {
            funnelName: response.data.data.templateName,
            snackMsg: 'next'
          };
        }

        // console.log(res)
        dispatch({
          type: 'GET_DIAGRAM',
          payload: {
            funnelId,
            res,
          }
        });
        dispatch({ type: 'GET_DIAGRAM_SUCCESS' });
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response)
          dispatch({
            type: 'GET_DIAGRAM_FAILURE',
            payload: error.response.data.error
          });
        }
      });
  }
}

export function changePermission(funnelId, profileId, permissions) {
  // console.log('changePermission action: ', funnelId, profileId, permissions)
  return function (dispatch) {
    API.patch(`/collaborator/${profileId}/${funnelId}`, {
      'permissions': permissions
    })
      .then(response => {
        // console.log('changePermission response: ', response.data.message)
        dispatch({
          type: 'COLLABORATORS_MODAL_MESSAGE_SUCCESS',
          payload: response.data.message
        });

      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response)
          dispatch({
            type: 'COLLABORATORS_MODAL_MESSAGE_FAILURE',
            payload: error.response.data.error
          });
        }
      });
  }
}

export function changeFunnelName(funnelId, funnelName) {
  // console.log('changeFunnelName action: ', funnelId, funnelName)
  return function (dispatch) {
    API.patch(`funnel/${funnelId}`, {
      'funnelName': funnelName
    })
      .then(response => {
        // console.log('changeFunnelName response: ', response.data)

        dispatch({
          type: 'CHANGE_FUNNEL_NAME_MESSAGE_SUCCESS',
          payload: response.data.message
        });

        setTimeout(() => {
          dispatch({ type: 'CHANGE_FUNNEL_NAME_MESSAGE_RESET' });
        }, 1000)

      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response)
          dispatch({
            type: 'CHANGE_FUNNEL_NAME_MESSAGE_FAILURE',
            payload: error.response.data.error
          });
        }
      });
  }
}

export function resetCollaboratorsModalMessage() {
  return function (dispatch) {
    dispatch({ type: 'COLLABORATORS_MODAL_MESSAGE_RESET' });
  }
}

export function removeCollaborator(funnelId, profileId) {
  return function (dispatch) {
    API.delete(`/collaborator/${profileId}/${funnelId}`, {
      // 'funnelId': funnelId,
      // 'profileId': profileId,
    })
      .then(response => {
        // console.log('removeCollaborator response: ', response.data)
        dispatch({
          type: 'COLLABORATORS_MODAL_MESSAGE_SUCCESS',
          payload: response.data.message
        });
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response)
          dispatch({
            type: 'COLLABORATORS_MODAL_MESSAGE_FAILURE',
            payload: error.response.data.error
          });
        }
      });
  }
}

export function sendImageToCollaborate(funnelId, image) {
  const token = JSON.parse(localStorage.getItem('token'));

  let bodyFormData = new FormData();
  bodyFormData.append('screenshot', image);
  bodyFormData.append('funnelsId', funnelId);
  bodyFormData.append('permissions', 'View Only');

  return function (dispatch) {
    axios({
      method: 'post',
      url: `${API_URL}/funnel/diagram/screenshot`,
      headers: {
        'authorization': token,
        'Content-Type': 'form-data'
      },
      data: bodyFormData
    })
      .then(response => {
        if (response.data) {
          dispatch({
            type: 'SEND_IMAGE_TO_COLLABORATE_LINK',
            payload: response.data.link
          });
        }
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response)
          dispatch({
            type: 'SEND_IMAGE_TO_COLLABORATE_LINK_FAILURE',
            payload: error.response.data.error
          });
        }
      });
  }
}

export const resetSendImageToCollaborateLink = () => dispatch => {
  dispatch({ type: 'SEND_IMAGE_TO_COLLABORATE_LINK_RESET' });
}

export const getSVG = () => dispatch => {
  API.get(`funnel/svg`)
    .then(response => {
      dispatch({
        type: 'GET_ALL_SVG',
        payload: response.data.response,
      });
      dispatch({ type: 'GET_ALL_SVG_SUCCESS' });
    })
    .catch(function (error) {
      if (error.response) {
        console.log(error.response)
        dispatch({
          type: 'GET_DIAGRAM_FAILURE',
          payload: error.response.data.error
        });
      }
    });
}

export const showSettingsModalOnlyBoolean = (boolean) => dispatch => {
  dispatch({
    type: 'CHANGE_SHOW_SETTINGS_MODAL',
    payload: {
      boolean
    }
  })
}

export const saveDiagramThenShowOrHideSettingsModal = (funnelId, diagramObj, image, boolean, model, engine) => dispatch => {
  const token = JSON.parse(localStorage.getItem('token'));
  let bodyFormData = new FormData();
  bodyFormData.append('funnelBackground', image);
  bodyFormData.append('funnelBody', JSON.stringify(diagramObj));

  axios({
    method: 'patch',
    url: `${API_URL}/funnel/diagram/${funnelId}`,
    headers: {
      'authorization': token,
      'Content-Type': 'form-data'
    },
    data: bodyFormData
  })
    .then(response => {

      let res1 = JSON.parse(response.data.data.funnelBody);
      let res = {
        converted: res1.converted,
        snackMsg: 'next'
      }
      dispatch({
        type: 'GET_DIAGRAM',
        payload: {
          funnelId,
          res,
        }
      });
      dispatch({
        type: 'CHANGE_SHOW_SETTINGS_MODAL',
        payload: {
          boolean,
          model,
          engine,
        }
      })
    })
    .catch(function (error) {
      if (error.response) {
        console.log(error.response)
        dispatch({
          type: 'CREATE_DIAGRAM_FAILURE',
          payload: error.response.data.error
        });
      }
    });
}



export const saveDiagramThenShowOrHideNotesModal = (funnelId, diagramObj, image, boolean, model, engine) => dispatch => {
  const token = JSON.parse(localStorage.getItem('token'));
  const bodyFormData = new FormData();
  bodyFormData.append('funnelBackground', image);
  bodyFormData.append('funnelBody', JSON.stringify(diagramObj));

  axios({
    method: 'patch',
    url: `${API_URL}/funnel/diagram/${funnelId}`,
    headers: {
      'authorization': token,
      'Content-Type': 'form-data'
    },
    data: bodyFormData
  })
    .then(response => {

      let res1 = JSON.parse(response.data.data.funnelBody);
      let res = {
        converted: res1.converted,
        snackMsg: 'next'
      }
      dispatch({
        type: 'GET_DIAGRAM',
        payload: {
          funnelId,
          res,
        }
      });
      dispatch({
        type: 'CHANGE_SHOW_NOTES_MODAL',
        payload: {
          boolean,
          model,
          engine,
        }
      })
    })
    .catch(function (error) {
      if (error.response) {
        console.log(error.response)
        dispatch({
          type: 'CREATE_DIAGRAM_FAILURE',
          payload: error.response.data.error
        });
      }
    });
} 