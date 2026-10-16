data.posts = frappe.db.get_all(
    "demo",
    fields=["link", "title", "description"],
    order_by="creation asc"
)
data.updates = frappe.db.get_all(
    "demob",
    fields=["image_qqvm", "title", "descripton"],
    order_by="creation asc"
)