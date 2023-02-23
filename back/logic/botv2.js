class Node {
    constructor(state, parent = null) {
        this.state = state;
        this.parent = parent;
        this.children = [];
        this.visits = 0;
        this.score = 0;
    }

    isLeafNode() {
        return this.children.length === 0;
    }

    isFullyExpanded() {
        return this.children.length === this.state.getPossibleMoves().length;
    }

    addChild(childState) {
        const childNode = new Node(childState, this);
        this.children.push(childNode);
        return childNode;
    }

    update(score) {
        this.visits++;
        this.score += score;
        if (this.parent) {
            this.parent.update(score);
        }
    }
}

class MCTS {
    constructor(state) {
        this.root = new Node(state);
        this.C = Math.sqrt(2); // exploration parameter
    }

    select() {
        let node = this.root;
        while (!node.isLeafNode()) {
            const scores = node.children.map(child => {
                const exploitationTerm = child.score / child.visits;
                const explorationTerm = this.C * Math.sqrt(Math.log(node.visits) / child.visits);
                return exploitationTerm + explorationTerm;
            });
            const selectedChildIndex = scores.indexOf(Math.max(...scores));
            node = node.children[selectedChildIndex];
        }
        return node;
    }

    expand(node) {
        const possibleMoves = node.state.getPossibleMoves();
        possibleMoves.forEach(move => {
            const childState = node.state.makeMove(move);
            node.addChild(childState);
        });
        return node.children[Math.floor(Math.random() * node.children.length)];
    }

    simulate(node) {
        const state = node.state.clone();
        let result = state.getResult();
        while (result === 0) {
            const possibleMoves = state.getPossibleMoves();
            const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
            state.makeMove(randomMove);
            result = state.getResult();
        }
        return result;
    }

    backpropagate(node, score) {
        node.update(score);
    }

    search(iterations) {
        for (let i = 0; i < iterations; i++) {
            const selectedNode = this.select();
            const expandedNode = selectedNode.isFullyExpanded() ? selectedNode : this.expand(selectedNode);
            const score = this.simulate(expandedNode);
            this.backpropagate(expandedNode, score);
        }
        const scores = this.root.children.map(child => child.score / child.visits);
        const bestChildIndex = scores.indexOf(Math.max(...scores));
        return this.root.children[bestChildIndex].state.getLastMove();
    }
}
