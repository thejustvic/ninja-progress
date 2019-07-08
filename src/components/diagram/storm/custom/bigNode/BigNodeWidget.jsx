import * as React from "react";
import { PortWidget, PointModel, DiagramEngine } from "storm-react-diagrams";
import ReactSVG from "react-svg";
import ClickOutside from "../../../../common/ClickOutside";
import ModalNodeWidget from "../../../../common/ModalNodeWidget";
import html2canvas from "html2canvas";

import { ReactComponent as CopySVG } from "../../../../../assets/selectForWidget/copy.svg";
import { ReactComponent as DeleteAllLinksSVG } from "../../../../../assets/selectForWidget/delete-all-links.svg";
import { ReactComponent as DeleteSVG } from "../../../../../assets/selectForWidget/delete.svg";
import { ReactComponent as NotesSVG } from "../../../../../assets/selectForWidget/notes.svg";
import { ReactComponent as SettingsSVG } from "../../../../../assets/selectForWidget/settings.svg";

import * as _ from "lodash";
import { AdvancedLinkModel, AdvancedLinkFactory } from "../customLink";
// import { BigNodeModel } from './BigNodeModel'

import { connect } from "react-redux";
import {
  saveDiagramThenShowOrHideSettingsModal,
  saveDiagramThenShowOrHideNotesModal
} from "../../../../../store/actions/projects";

//import custom link, port and factory
import { NodeFactory } from "../NodeFactory";
import { PortFactory } from "../PortFactory";

// import the custom models
import { CustomNodeModel } from "../CustomNodeModel";
import { CustomPortModel } from "../CustomPortModel";
import SmallNodeWidget from "../smallNode/SmallNodeWidget";

import { API_URL } from "../../../../../config";

import randomString from "random-string";

const Select = ({ show, children }) => {
  const showHideClassName = show
    ? "select-modal-node-widget display-block"
    : "select-modal-node-widget display-none";
  return (
    <div className={showHideClassName}>
      <section className="select-main-modal-node-widget  up-arrow ">
        {children}
      </section>
    </div>
  );
};

class BigNodeWidget extends React.Component {
  state = {
    show: false
    // label: this.props.node.extras.named,
    // notes: this.props.node.extras.notesd,
  };

  serialization(activeModel) {
    const { svgList } = this.props;

    this.allElements = [];
    this.elementsPages = [];
    this.elementsTraffic = [];
    this.elementsEmailMarketing = [];
    this.elementsEvents = [];

    if (svgList) {
      let allPages = this.getValues(svgList, "Pages");
      let allTraffic = this.getValues(svgList, "Traffic");
      let allEmailMarketing = this.getValues(svgList, "EmailMarketing");
      let allEvents = this.getValues(svgList, "Events");

      allPages.forEach(item =>
        this.elementsPages.push({
          name: item.name,
          port: CustomPortModel,
          widget: BigNodeWidget,
          nodeModel: CustomNodeModel,
          svg: API_URL + item.url
        })
      );

      allTraffic.forEach(item =>
        this.elementsTraffic.push({
          name: item.name,
          port: CustomPortModel,
          widget: SmallNodeWidget,
          nodeModel: CustomNodeModel,
          svg: API_URL + item.url
        })
      );

      allEmailMarketing.forEach(item =>
        this.elementsEmailMarketing.push({
          name: item.name,
          port: CustomPortModel,
          widget: SmallNodeWidget,
          nodeModel: CustomNodeModel,
          svg: API_URL + item.url
        })
      );

      allEvents.forEach(item =>
        this.elementsEvents.push({
          name: item.name,
          port: CustomPortModel,
          widget: SmallNodeWidget,
          nodeModel: CustomNodeModel,
          svg: API_URL + item.url
        })
      );

      // We need this to help the system know what models to create form the JSON
      let engine = new DiagramEngine();
      engine.installDefaultFactories();
      engine.registerLinkFactory(new AdvancedLinkFactory());

      this.createElements(this.allElements, engine);

      // Serialize the model
      const str = JSON.stringify(activeModel.serializeDiagram());
      return str;
    }
  }

  getValues(array, value) {
    var obj = array.filter((arr, i) => {
      return arr.title === value ? arr.data : null;
    });
    return obj[0].data;
  }

  createElements(configElements, engine) {
    return configElements.forEach(item => {
      engine.registerPortFactory(
        new PortFactory(item.name, () => new item.port(item.name))
      );
      engine.registerNodeFactory(
        new NodeFactory(item.name, item.widget, item.nodeModel, item.svg)
      );
    });
  }

  showModal = () =>
    this.setState({
      show: true
    });

  hideModal = () => {
    this.setState({ show: false });
  };

  deleteNode = e => {
    this.simulateKey(46, "up");
  };

  simulateKey(keyCode, type) {
    var evtName = typeof type === "string" ? "key" + type : "keydown";
    var event = document.createEvent("HTMLEvents");
    event.initEvent(evtName, true, false);
    event.keyCode = keyCode;
    document.dispatchEvent(event);
  }

  cloneSelected = () => {
    let { engine } = this.props;
    let offset = { x: 100, y: 100 };
    let model = engine.getDiagramModel();
    let itemMap = {};
    _.forEach(model.getSelectedItems(), item => {
      let newItem = item.clone(itemMap);
      // offset the nodes slightly
      if (newItem instanceof CustomNodeModel) {
        newItem.setPosition(newItem.x + offset.x, newItem.y + offset.y);
        model.addNode(newItem);
        this.forceUpdate();
      } else if (newItem instanceof AdvancedLinkModel) {
        // offset the link points
        newItem.getPoints().forEach(p => {
          p.updateLocation({ x: p.getX() + offset.x, y: p.getY() + offset.y });
        });
        model.addLink(newItem);
      }
      newItem.selected = false;
    });
    this.hideModal();
    this.forceUpdate();
    document.getElementById("diagram-layer").click();
  };

  deleteAllLinks = () => {
    _.forEach(this.props.engine.getDiagramModel().getSelectedItems(), item => {
      if (item instanceof PointModel) {
        item.parent.remove();
      }
    });
    document.getElementById("diagram-layer").click();
  };

  SaveDiagramThenShowSettingsModal = file => {
    this.setState(
      {
        snackMsg: "next",
        converted: this.serialization(this.props.engine.getDiagramModel())
      },
      () => {
        this.props.saveDiagramThenShowOrHideSettingsModal(
          this.props.funnelId,
          this.state,
          file,
          true,
          this.props.node,
          this.props.engine.getDiagramModel()
        );
      }
    );
  };

  showSettingsModal = () => {
    const name = randomString({ length: 10 });
    const file = new File(["test"], name, {
      type: "image/png"
    });
    this.SaveDiagramThenShowSettingsModal(file);
  };

  SaveDiagramThenShowNotesModal = file => {
    this.setState(
      {
        snackMsg: "next",
        converted: this.serialization(this.props.engine.getDiagramModel())
      },
      () => {
        this.props.saveDiagramThenShowOrHideNotesModal(
          this.props.funnelId,
          this.state,
          file,
          true,
          this.props.node,
          this.props.engine.getDiagramModel()
        );
      }
    );
  };

  showNotesModal = () => {
    const name = randomString({ length: 10 });
    const file = new File(["test"], name, {
      type: "image/png"
    });
    this.SaveDiagramThenShowNotesModal(file);
  };

  render() {
    // console.log('this.props.node.extras: ', this.props.node.extras)
    return (
      <>
        <div
          className="big-area-for-hover"
          onMouseEnter={this.showModal}
          onMouseLeave={this.hideModal}
        />
        <ClickOutside
          onClickOutside={() => {
            this.setState({ show: false });
          }}
          onMouseEnter={this.showModal}
          onMouseLeave={this.hideModal}
        >
          <Select show={this.state.show}>
            <button
              className="btn-select-widget"
              onClick={this.showSettingsModal}
              title={"Settings"}
            >
              <SettingsSVG />
            </button>
            <button
              className="btn-select-widget"
              onClick={this.showNotesModal}
              title={"Notes"}
            >
              <NotesSVG />
            </button>
            <button
              className="btn-select-widget"
              onClick={this.cloneSelected}
              title={"Copy"}
            >
              <CopySVG />
            </button>
            <button
              className="btn-select-widget"
              onClick={this.deleteNode}
              title={"Delete"}
            >
              <DeleteSVG />
            </button>
            <button
              className="btn-select-widget"
              onClick={this.deleteAllLinks}
              title={"Delete All Links"}
            >
              <DeleteAllLinksSVG />
            </button>
          </Select>
        </ClickOutside>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <div
            style={{
              position: "absolute",
              zIndex: 10,
              top: -36,
              fontSize: 13,
              color: "#212939",
              fontWeight: 500
            }}
          >
            {this.props.node.extras.named
              ? this.props.node.extras.named
              : this.props.node.type}
          </div>

          <div
            style={{
              position: "relative",
              height: this.props.node.selected ? 122 : null,
              width: this.props.node.selected ? 92 : null,
              border: this.props.node.selected ? ".5px dashed #848f99" : null,
              borderRadius: this.props.node.selected ? 7 : null
            }}
            onMouseEnter={this.showModal}
            onMouseLeave={this.hideModal}
            title={
              this.props.node.extras.named
                ? this.props.node.extras.named
                : this.props.node.type
            }
          >
            <ReactSVG src={this.props.svg} />

            <div
              style={{
                position: "absolute",
                zIndex: 10,
                top: 55,
                left: -13
              }}
            >
              <PortWidget name="left" node={this.props.node} />
            </div>

            <div
              style={{
                position: "absolute",
                zIndex: 10,
                top: -13,
                left: 38
              }}
            >
              <PortWidget name="top" node={this.props.node} />
            </div>

            <div
              style={{
                position: "absolute",
                zIndex: 10,
                top: 55,
                left: 90
              }}
            >
              <PortWidget name="right" node={this.props.node} />
            </div>

            <div
              style={{
                position: "absolute",
                zIndex: 10,
                top: 119,
                left: 38
              }}
            >
              <PortWidget name="bottom" node={this.props.node} />
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    showSettingsWidgetBoolean: state.projects.showSettingsWidgetBoolean,
    showSettingsWidgetModel: state.projects.showSettingsWidgetModel,

    showNotesWidgetBoolean: state.projects.showNotesWidgetBoolean,
    showNotesWidgetModel: state.projects.showNotesWidgetModel,

    funnelId: state.router.location.pathname.substring(9),
    svgList: state.projects.svgList
  };
};

const mapDispatchToProps = dispatch => {
  return {
    saveDiagramThenShowOrHideSettingsModal: (
      id,
      state,
      file,
      boolean,
      model,
      engine
    ) =>
      dispatch(
        saveDiagramThenShowOrHideSettingsModal(
          id,
          state,
          file,
          boolean,
          model,
          engine
        )
      ),

    saveDiagramThenShowOrHideNotesModal: (
      id,
      state,
      file,
      boolean,
      model,
      engine
    ) =>
      dispatch(
        saveDiagramThenShowOrHideNotesModal(
          id,
          state,
          file,
          boolean,
          model,
          engine
        )
      )
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BigNodeWidget);
