describe("iD.actions.DeleteMultiple", function () {
    it("deletes multiple entities of heterogeneous types", function () {
        var n      = iD.Node(),
            w      = iD.Way(),
            r      = iD.Relation(),
            action = iD.actions.DeleteMultiple([n.id, w.id, r.id]),
            graph  = action(iD.Graph([n, w, r]));
        expect(graph.entity(n.id)).to.be.undefined;
        expect(graph.entity(w.id)).to.be.undefined;
        expect(graph.entity(r.id)).to.be.undefined;
    });

    it("deletes a way and one of its nodes", function () {
        var n      = iD.Node(),
            w      = iD.Way({nodes: [n.id]}),
            action = iD.actions.DeleteMultiple([w.id, n.id]),
            graph  = action(iD.Graph([n, w]));
        expect(graph.entity(w.id)).to.be.undefined;
        expect(graph.entity(n.id)).to.be.undefined;
    });
});
