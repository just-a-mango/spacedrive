use crate::{
	api::CoreEvent, job::DynJob, location::LocationManager, node::NodeConfigManager,
	object::preview::THUMBNAIL_CACHE_DIR_NAME, prisma::PrismaClient, sync::SyncManager,
	NodeContext,
};

use std::{
	fmt::{Debug, Formatter},
	sync::Arc,
};

use sd_crypto::keys::keymanager::KeyManager;
use tracing::warn;
use uuid::Uuid;

use super::LibraryConfig;

/// LibraryContext holds context for a library which can be passed around the application.
#[derive(Clone)]
pub struct Library {
	/// id holds the ID of the current library.
	pub id: Uuid,
	/// local_id holds the local ID of the current library.
	pub local_id: i32,
	/// config holds the configuration of the current library.
	pub config: LibraryConfig,
	/// db holds the database client for the current library.
	pub db: Arc<PrismaClient>,
	pub sync: Arc<SyncManager>,
	/// key manager that provides encryption keys to functions that require them
	pub key_manager: Arc<KeyManager>,
	/// node_local_id holds the local ID of the node which is running the library.
	pub node_local_id: i32,
	/// node_context holds the node context for the node which this library is running on.
	pub(super) node_context: NodeContext,
}

impl Debug for Library {
	fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
		// Rolling out this implementation because `NodeContext` contains a DynJob which is
		// troublesome to implement Debug trait
		f.debug_struct("LibraryContext")
			.field("id", &self.id)
			.field("config", &self.config)
			.field("db", &self.db)
			.field("node_local_id", &self.node_local_id)
			.finish()
	}
}

impl Library {
	pub(crate) async fn spawn_job(&self, job: Box<dyn DynJob>) {
		self.node_context.jobs.clone().ingest(self, job).await;
	}

	pub(crate) async fn queue_job(&self, job: Box<dyn DynJob>) {
		self.node_context.jobs.ingest_queue(job).await;
	}

	pub(crate) fn emit(&self, event: CoreEvent) {
		if let Err(e) = self.node_context.event_bus_tx.send(event) {
			warn!("Error sending event to event bus: {e:?}");
		}
	}

	pub(crate) fn config(&self) -> Arc<NodeConfigManager> {
		self.node_context.config.clone()
	}

	pub(crate) fn location_manager(&self) -> &Arc<LocationManager> {
		&self.node_context.location_manager
	}

	pub async fn thumbnail_exists(&self, cas_id: &str) -> tokio::io::Result<bool> {
		let thumb_path = self
			.config()
			.data_directory()
			.join(THUMBNAIL_CACHE_DIR_NAME)
			.join(cas_id)
			.with_extension("webp");

		match tokio::fs::metadata(thumb_path).await {
			Ok(_) => Ok(true),
			Err(e) if e.kind() == tokio::io::ErrorKind::NotFound => Ok(false),
			Err(e) => Err(e),
		}
	}
}
